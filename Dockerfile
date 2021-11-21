FROM mlrepa/wrk_bin_clf_base1:latest

COPY ./requirements.txt /tmp/requirements.txt
RUN sudo pip install --ignore-installed -r /tmp/requirements.txt

RUN sudo jupyter contrib nbextension install && \
    jupyter nbextension enable toc2/main

WORKDIR /home/research
ENV PYTHONPATH=/home/research

USER root

CMD jupyter-notebook --ip=0.0.0.0 --port 7777 \
                     --no-browser --allow-root --debug \
                     --NotebookApp.token='' \
                     --NotebookApp.notebook_dir='/home/research/notebooks'
