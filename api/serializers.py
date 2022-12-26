from rest_framework.serializers import ModelSerializer
from stock.models import Producto, Almacen, Stock, Pedido, PedidoProducto
from django.contrib.auth.models import User
from pprint import pprint

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')

class ProductoSerializer(ModelSerializer):
    class Meta:
        model = Producto
        fields = ('id', 'nombre', 'sku', 'precio')

class AlmacenSerializer(ModelSerializer):
    class Meta:
        model = Almacen
        fields = ('id', 'nombre', 'ubicacion')

class StockSerializer(ModelSerializer):
    class Meta:
        model = Stock
        fields = ('id', 'producto', 'almacen', 'cantidad')

class ProductoCantidadSerializer(ModelSerializer):
    producto = ProductoSerializer(read_only=True)
    class Meta:
        model = PedidoProducto
        fields = ('producto', 'cantidad')

class PedidoSerializer(ModelSerializer):
    almacen = AlmacenSerializer(read_only=True)
    pedido_productos = ProductoCantidadSerializer(many=True)
    class Meta:
        model = Pedido
        fields = ('id', 'almacen', 'total', 'creado', 'modificado', 'pedido_productos')

class PedidoProductoSerializer(ModelSerializer):
    pedido = PedidoSerializer(read_only=True)
    producto = ProductoSerializer(read_only=True)
    class Meta:
        model = PedidoProducto
        fields = ('pedido', 'producto', 'cantidad')

class PedidoProductoSaveSerializer(ModelSerializer):
    class Meta:
        model = PedidoProducto
        fields = ('producto', 'cantidad')

class PedidoSaveSerializer(ModelSerializer):
    pedido_productos = PedidoProductoSaveSerializer(many=True)
    class Meta:
        model = Pedido
        fields = ('almacen', 'total', 'pedido_productos')
    def create(self, validated_data):
        pedido_productos_data = validated_data.pop('pedido_productos')
        pedido = Pedido.objects.create(**validated_data)
        for producto_data in pedido_productos_data:
            pprint(producto_data)
            PedidoProducto.objects.create(pedido=pedido, **producto_data)
        return pedido