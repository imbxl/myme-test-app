# Generated by Django 4.1.4 on 2022-12-22 11:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stock', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Almacenes',
            new_name='Almacen',
        ),
        migrations.RenameModel(
            old_name='Productos',
            new_name='Producto',
        ),
    ]