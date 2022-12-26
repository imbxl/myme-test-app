from rest_framework.viewsets import ModelViewSet
from stock.models import Stock, Producto, Almacen, Pedido
from api.serializers import StockSerializer, ProductoSerializer, AlmacenSerializer, UserSerializer, PedidoSerializer, PedidoSaveSerializer

class UserApiViewSet(ModelViewSet):
    serializer_class = UserSerializer
    def get_queryset(self):
        user = self.request.user
        return [user]

class ProductoApiViewSet(ModelViewSet):
    serializer_class = ProductoSerializer
    queryset = Producto.objects.all()

class AlmacenApiViewSet(ModelViewSet):
    serializer_class = AlmacenSerializer
    queryset = Almacen.objects.all()

class StockApiViewSet(ModelViewSet):
    serializer_class = StockSerializer
    queryset = Stock.objects.all()
    def get_queryset(self):
        queryset = Stock.objects.all()
        almacen = self.request.query_params.get('almacen')
        if almacen is not None:
            queryset = queryset.filter(almacen=almacen)
        return queryset

class PedidoApiViewSet(ModelViewSet):
    serializer_class = PedidoSerializer
    queryset = Pedido.objects.all()
    def get_serializer_class(self): 
        serializer_class = self.serializer_class 
        if self.request.method == 'POST': 
            serializer_class = PedidoSaveSerializer 
        return serializer_class