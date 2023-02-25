# DevOps Take-Home Exercise

This example shows the implementation of a microservices system using different code languages, with apis "users" in PHP and "shifts" in NodeJS.
They are totally independent, having their own staging/production and database settings. And each has its settings and autoscaling times.

They are also cloud server independent and can be installed anywhere that has a Kubernetes framework.

## Install the Ingress Controller (Helm v3)

For this solution, we use ingress, if you don't have it, follow these steps:

- https://kubernetes.github.io/ingress-nginx/deploy/

In case you are using the docker desktop, just run the command below:

```
helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace
```

## Check metrics system

Make sure the metric server is running. It is essential to ensure autoscale functionality.

```
kubectl get deployment metrics-server -n kube-system
```

If not then you cant to install it or install the prometheus-adapter:
https://github.com/kubernetes-sigs/prometheus-adapter

To install metrics system

On my mac it only worked after I downloaded the yaml and edited it as shown in the following steps (or apply k8s/metrics/fix-metrics/components.yaml file):

1. Download this file: https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
2. Edit and edit args section under deployment

```
spec:
  containers:
  - args:
    - --cert-dir=/tmp
    - --secure-port=443
    - --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname
    - --kubelet-use-node-status-port
    - --metric-resolution=15s
```

add there two more lines:

```
    - --kubelet-insecure-tls=true
    - --kubelet-preferred-address-types=InternalIP
```

3. Save and apply this file

```
kubectl apply -f components.yaml

```

## General configurations for kubernetes

Apply global kubernetes configuration by running below command from root folder:

```
kubectl apply -f k8s
```

## For users api

### Build Docker

Build the PHP/Apache image in the local environment by running the command below:

```
cd /users
docker build -t thusers-php-apache .
```

This local image works because I set imagePullPolicy: IfNotPresent

### Install on Kubernetes

Apply deployment, service and ingress to Kubernetes.

```
cd /users
kubectl apply -f k8s
```

### Configure local access

To access the API it is necessary to configure the hosts file.
To do this, paste the line below:

```
127.0.0.1       users.thinkon
```

Into the file (case linux or mac):

```
sudo vi /etc/hosts
```

Now just access http://users.thinkon

## For shifts api

### Build Docker

Build the NodeJS image in the local environment by running the command below:

```
cd /shifts
docker build -t thshifts-nodejs .
```

This local image works because I set imagePullPolicy: IfNotPresent

### Install on Kubernetes

Apply deployment, service and ingress to Kubernetes.

```
cd /shifts
kubectl apply -f k8s-prod
```

### Configure local access

To access the API it is necessary to configure the hosts file.
To do this, paste the line below:

```
127.0.0.1       shifts.thinkon
```

Into the file (case linux or mac):

```
sudo vi /etc/hosts
```

Now just access http://shifts.thinkon/

## IAM Roles

To assign limited roles to developers in GKE we can define them with "container.clusterViewer" permission and add some custom rules like: "container.deployments.rollback", "container.deployments.update", "container.pods.update".

But my recommendation here is that deployments happen through CI/CD. It can be more automatic in staging and more controlled by a leader in a production environment.

In this case we are free from the cloud environment and we can be in multiple locations such as Azure, GCloud, IBM Cloud, AWS, Red Hat etc.

## Apply the configs to multiple environments

In the "shifts" folder we can see an example of staging vs production deployments

In my example, I use the environment variable to load and set specific settings for the development scope, such as database configuration.

For the scope of Kubernetes, I separated it into 2 folders: k8s-prod for production and k8s-staging for staging.
This way we can configure CI/CD to run different files in different execution queues.
In the case of github actions for example, we can configure the script saying that if it is a staging branch we will run the k8s-staging folder.

Therefore, the cloud infrastructure does not matter anymore. Since staging can be on AWS and production on GCloud without any problems.

## To auto-scale the deployment based on network latency

We need to create custom metrics and an alternative is to integrate with Ingress and get requests per second:

```
- type: Object
    object:
      metric:
        name: requests-per-second
      describedObject:
        apiVersion: networking.k8s.io/v1
        kind: Ingress
        name: main-route
      target:
        type: Value
        value: 10k
```

There are other ways, but my current recomendation is to follow the article:
https://blog.sighup.io/scale-workloads-with-ingress-traffic/

1. Install Prometheus Adapter for Kubernetes Metrics APIs;
2. Create a new rule in Adapter:

```
rules:
  - seriesQuery: '{__name__=~"^nginx_ingress_controller_requests.*",namespace!=""}'
    seriesFilters: []
    resources:
      template: <<.Resource>>
      overrides:
        exported_namespace:
          resource: "namespace"
    name:
      matches: ""
      as: "nginx_ingress_controller_requests_rate"
    metricsQuery: round(sum(rate(<<.Series>>{<<.LabelMatchers>>}[1m])) by (<<.GroupBy>>), 0.001)
```

3. Add new metric in HPA like:

```
metrics:
    - type: Object
      object:
        metric:
          name: nginx_ingress_controller_requests_rate
        describedObject:
          apiVersion: extensions/v1beta1
          kind: Ingress
          name: apache2
        target:
          type: AverageValue
          averageValue: "100"
```

Finally, you can test using the hey tool:

```
hey -n 20000 -q 120 -c 1 http://users.thinkon/
```

And see the auto scale happening:

```
kubectl get pods -n thinkon

kubectl get hpa -n thinkon

kubectl get --raw "/apis/custom.metrics.k8s.io/v1beta1/namespaces/thinkon/ingress/apache2/nginx_ingress_controller_requests_rate" | jq .
```
