from django.contrib import admin
from stock.models import Producto, Almacen, Pedido, PedidoProducto, Stock

# Register your models here.

class ProductoAdmin(admin.ModelAdmin):
    list_display = ("nombre", "sku", "precio")
    search_fields = ("nombre", "sku")

class AlmacenAdmin(admin.ModelAdmin):
    list_display = ("nombre","ubicacion")
    search_fields = ("nombre","ubicacion")

class ProductoInline(admin.TabularInline):
    model = PedidoProducto
    extra = 0
class PedidoAdmin(admin.ModelAdmin):
    inlines = (ProductoInline,)
    list_display = ("id","almacen","creado")
    search_fields = ("almacen","creado")

class StockAdmin(admin.ModelAdmin):
    list_filter = ('almacen', 'producto')
    list_display = ("almacen", "producto", "cantidad")
    search_fields = ("almacen", "producto", "cantidad")

admin.site.register(Producto, ProductoAdmin)
admin.site.register(Almacen, AlmacenAdmin)
admin.site.register(Pedido, PedidoAdmin)
admin.site.register(Stock, StockAdmin)