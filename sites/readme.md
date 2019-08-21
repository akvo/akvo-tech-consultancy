# Online Website

The Site folder is a special space used to deploy online app / website which has accesibility within URL.

## Deploying Static HTML or PHP

We use SiteGround to deploy simple sites that just require either static html or php.


![siteground](https://raw.githubusercontent.com/dedenbangkit/gambar/master/siteground.jpg)


### Step by Step

- Create new subdomain on siteground.
- Copy [this file](https://github.com/akvo/akvo-tech-consultancy/blob/master/sites/unicef-sig-map/ci/deploy.sh) to your CI folder'
- Replace all the endpoint with the folder that you have here.
- Create build command travis to build your app, you can also follow this [build example](https://github.com/akvo/akvo-tech-consultancy/blob/master/sites/unicef-sig-map/ci/build.sh).
- Upload .env files over SSH

_Note : Production build must be done before syncrhonization (Web-pack, Composer, or other dependencies)._

-----------------------

## Deploying More Complex App

For websites with more complex requirements, we will deploy them to Akvo's Kubernetes (k8s) infrastructure. 
To avoid having to create new DNS entries and new k8s ingresses, all the tech consultancy custom websites will share one
domain and a gateway (Nginx server) will redirect the traffic to the appropriate application depending on the url context.
This directory contains the k8s deployment for this gateway.

![k8s](https://raw.githubusercontent.com/dedenbangkit/gambar/master/k8s.jpg)

- All the sites will be available under https://tech-consultancy.akvotest.org
- The first path segment denotes the service to serve the request. It is expected that there will be a k8s service named *tech-consultancy-$first_path_segment*.
- The application url will not include the first path segment.

For example, the request to ```https://tech-consultancy.akvotest.org/chatbot/api/v2``` will be redirected to the k8s service
```tech-consultancy-chatbot``` with url ```/api/v2```.

_Note: https://tech-consultancy.akvotest.org/chatbot will not work but https://tech-consultancy.akvotest.org/chatbot/ will._

-------------------------

## List of Deployed App


|Application/Services|Project|Location|
|---------|-----|------|
|akvo-flow-web-api|Akvo|k8s|
|akvo-flow-web|Akvo|k8s|
|anu-lumen-pages|ANU|SG|
|as-flow-chatbot|Angkor Salad|k8s|
|as-flow-chatbot|Angkor Salad|k8s|
|gc-flow-price-webhook|Green Coffee|k8s|
|unicef-sig-map|Unicef Pacific|SG|

