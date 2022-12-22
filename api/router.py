from rest_framework.routers import DefaultRouter
from api.views import StockApiViewSet, ProductoApiViewSet, AlmacenApiViewSet

router_stock = DefaultRouter()
router_stock.register(prefix='producto', basename='producto', viewset=ProductoApiViewSet)
router_stock.register(prefix='almacen', basename='almacen', viewset=AlmacenApiViewSet)
router_stock.register(prefix='stock', basename='stock', viewset=StockApiViewSet)