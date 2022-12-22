from django.contrib import admin
from stock.models import Producto, Almacen, Stock

# Register your models here.
admin.site.register(Producto)
admin.site.register(Almacen)
admin.site.register(Stock)