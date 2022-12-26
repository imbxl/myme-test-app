from django.db import models

# Create your models here.
class Producto(models.Model):
    nombre=models.CharField(max_length=200)
    sku=models.CharField(max_length=200)
    precio=models.FloatField()
    def __str__(self):
        return self.nombre

class Almacen(models.Model):
    nombre=models.CharField(max_length=200)
    ubicacion=models.CharField(max_length=200)
    class Meta:
        verbose_name_plural = "Almacenes"
    def __str__(self):
        return self.nombre

class Stock(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    almacen = models.ForeignKey(Almacen, on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    class Meta:
        unique_together = (('producto','almacen'),)
        verbose_name_plural = "Stock"

class Pedido(models.Model):
    almacen = models.ForeignKey(Almacen, related_name='pedidos', on_delete=models.CASCADE, null=True, blank=True);
    total = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    creado = models.DateTimeField(auto_now_add=True)
    modificado = models.DateTimeField(auto_now=True)

class PedidoProducto(models.Model):
    pedido = models.ForeignKey(Pedido, related_name='pedido_productos', on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, related_name='pedido_productos', on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(null=True, blank=True)
    def __unicode__(self):
        return '%s x %s' % (self.cantidad, self.producto.nombre)