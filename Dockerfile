FROM node:12-alpine as build
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package-lock.json /app/package-lock.json
COPY package.json /app/package.json

RUN npm install
COPY . /app
#RUN ng build --output-path=dist
RUN ng build --prod --output-path=dist

## New docker image ##

FROM nginx:1.15.12-alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
