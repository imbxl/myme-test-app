from rest_framework.routers import DefaultRouter
from api.views import StockApiViewSet, ProductoApiViewSet, AlmacenApiViewSet, UserApiViewSet, PedidoApiViewSet

router_stock = DefaultRouter()
router_stock.register(prefix='user', basename='user', viewset=UserApiViewSet)
router_stock.register(prefix='producto', basename='producto', viewset=ProductoApiViewSet)
router_stock.register(prefix='almacen', basename='almacen', viewset=AlmacenApiViewSet)
router_stock.register(prefix='stock', basename='stock', viewset=StockApiViewSet)
router_stock.register(prefix='pedido', basename='pedido', viewset=PedidoApiViewSet)