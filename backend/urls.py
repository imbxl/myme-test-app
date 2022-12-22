from django.contrib import admin
from django.urls import path, re_path
from django.views.generic import TemplateView

admin.site.site_header = "Administración de Stock"
admin.site.site_title = "Administración de Stock"
admin.site.index_title = "Bienvenido al sistema de control de Stock"

urlpatterns = [
    path('admin/', admin.site.urls),
    re_path(r".*", TemplateView.as_view(template_name='index.html')),
]
