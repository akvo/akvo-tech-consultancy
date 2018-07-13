FROM google/cloud-sdk:206.0.0-alpine

ARG PANDAS_VERSION=0.23.0
RUN apk add --no-cache python3 python3-dev libstdc++ && \
    apk add --no-cache --virtual .build-deps g++ && \
    ln -s /usr/include/locale.h /usr/include/xlocale.h && \
    pip3 install numpy==1.14.0 && \
    pip3 install pandas==${PANDAS_VERSION} && \
    pip3 install requests && \
    apk del .build-deps

COPY run.sh /app/
COPY FlowApi.py /app/

WORKDIR /app

CMD ./run.sh