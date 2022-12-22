from rest_framework.serializers import ModelSerializer
from stock.models import Producto, Almacen, Stock
from django.contrib.auth.models import User

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class ProductoSerializer(ModelSerializer):
    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'sku', 'precio']

class AlmacenSerializer(ModelSerializer):
    class Meta:
        model = Almacen
        fields = ['id', 'nombre', 'ubicacion']

class StockSerializer(ModelSerializer):
    class Meta:
        model = Stock
        fields = ['id', 'producto_id', 'almacen_id', 'cantidad']