We use SiteGround to deploy simple sites that just require either static html or php.

For websites with more complex requirements, we will deploy them to Akvo's Kubernetes (k8s) infrastructure. 

To avoid having to create new DNS entries and new k8s ingresses, all the tech consultancy custom websites will share one
domain and a gateway (Nginx server) will redirect the traffic to the appropriate application depending on the url context.

This directory contains the k8s deployment for this gateway. 

The setup:

![setup](http://www.plantuml.com/plantuml/proxy?src=https://raw.githubusercontent.com/akvo/akvo-tech-consultancy/sites/k8s-gateway/architecture.puml)

So:

1. All the sites will be available under https://tech-consultancy.akvotest.org
2. The first path segment denotes the service to serve the request. It is expected that there will be a k8s service named "tech-consultancy-$first_path_segment".
3. The application url will not include the first path segment.

For example, the request to https://tech-consultancy.akvotest.org/chatbot/api/v2 will be redirected to the k8s service
"tech-consultancy-chatbot" with url "/api/v2".

Note: https://tech-consultancy.akvotest.org/chatbot will not work but https://tech-consultancy.akvotest.org/chatbot/ will.