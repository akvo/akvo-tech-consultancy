## BUILD

```
docker build -t form-dumps .
```
## RUN

```bash
docker run -v --rm -v $(pwd):/repo -e INSTANCE='<instance_name>' -e FID='<form_id>' form-dumps
```
