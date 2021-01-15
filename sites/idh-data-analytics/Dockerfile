FROM rstudio/plumber

RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
        libudunits2-dev \
        libgdal-dev \
        libgeos-dev \
        libproj-dev

RUN R -e "\
    install.packages('rmarkdown', repos='http://cran.rstudio.com/'); \
    install.packages('dplyr', repos='http://cran.rstudio.com/'); \
    install.packages('tidyr', repos='http://cran.rstudio.com/'); \
    install.packages('tidylog', repos='http://cran.rstudio.com/'); \
    install.packages('readr', repos='http://cran.rstudio.com/'); \
    install.packages('data.table', repos='http://cran.rstudio.com/'); \
    install.packages('ggplot2', repos='http://cran.rstudio.com/'); \
    install.packages('reshape2', repos='http://cran.rstudio.com/'); \
    install.packages('openxlsx', repos='http://cran.rstudio.com/'); \
    install.packages('Hmisc', repos='http://cran.rstudio.com/'); \
    install.packages('here', repos='http://cran.rstudio.com/'); \
    install.packages('zoo', repos='http://cran.rstudio.com/'); \
    install.packages('readxl', repos='http://cran.rstudio.com/'); \
    install.packages('splitstackshape', repos='http://cran.rstudio.com/'); \
    install.packages('sf', repos='http://cran.rstudio.com/'); \
    install.packages('jsonlite', repos='http://cran.rstudio.com/'); \
    install.packages('curl', repos='http://cran.rstudio.com/'); \
"

WORKDIR /usr/src/app

COPY idh.R api.R

EXPOSE 8000
ENTRYPOINT ["R", "-e", "library(plumber); pr <- plumber::plumb(rev(commandArgs())[1]); pr$run(host='0.0.0.0', port=8000, swagger=TRUE)"]
CMD ["/usr/src/app/api.R"]