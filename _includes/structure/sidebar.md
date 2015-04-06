{% loop_directory directory:doc iterator:file filter:.md sort:descending %}
   {% render_link file %}
{% endloop_directory %}
