FROM php:8.2-apache

RUN apt-get -y update && apt-get -y upgrade \
    && apt-get install -y --no-install-recommends openssl libssl-dev libcurl4-openssl-dev

RUN pecl install mongodb

RUN cp /usr/local/etc/php/php.ini-production /usr/local/etc/php/php.ini \
    && echo "extension=mongodb.so" >> /usr/local/etc/php/php.ini \
    && apt-get clean \
    &&  rm -rf /var/lib/apt/lists/* 

COPY src/ /var/www/html/
RUN sed -i "s/Listen 80/Listen 8080/" /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf
EXPOSE 8080
