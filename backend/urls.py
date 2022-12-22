from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView
from rest_framework.authtoken import views

from api.router import router_stock

admin.site.site_header = "Administración de Stock"
admin.site.site_title = "Administración de Stock"
admin.site.index_title = "Bienvenido al sistema de control de Stock"

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router_stock.urls)),
    path('api_token/', views.obtain_auth_token),
    re_path(r".*", TemplateView.as_view(template_name='index.html')),
]
