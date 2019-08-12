### Add new sysadmin

1. Jump to CKAN pod
```
kubectl exec $(kubectl get pods -l "app=akvo-ckan" -o jsonpath="{.items[0].metadata.name}") -it bash
```
1. Setup bash session:
```
. /usr/lib/ckan/default/bin/activate
cd /usr/lib/ckan/default/src/ckan
```
1. Find the user name:
```
paster user -c /etc/ckan/default/production.ini
```
1. Switch to sysadmin:
```
paster sysadmin -c /etc/ckan/default/production.ini add $THE_USER_NAME
```