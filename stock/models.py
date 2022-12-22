from django.db import models

# Create your models here.
class Producto(models.Model):
    nombre=models.CharField(max_length=200)
    sku=models.CharField(max_length=200)
    precio=models.FloatField()

class Almacen(models.Model):
    nombre=models.CharField(max_length=200)
    ubicacion=models.CharField(max_length=200)
    class Meta:
        verbose_name_plural = "Almacenes"

class Stock(models.Model):
    class Meta:
        unique_together = (('producto_id','almacen_id'),)
        verbose_name_plural = "Stock"

    producto_id = models.ForeignKey(Producto, on_delete=models.CASCADE)
    almacen_id = models.ForeignKey(Almacen, on_delete=models.CASCADE)
    cantidad = models.IntegerField()