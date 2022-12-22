from rest_framework.viewsets import ModelViewSet
from stock.models import Stock, Producto, Almacen
from api.serializers import StockSerializer, ProductoSerializer, AlmacenSerializer, UserSerializer

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