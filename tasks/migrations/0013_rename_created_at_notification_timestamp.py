# Generated by Django 5.1.4 on 2025-01-27 13:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0012_notification_is_read_alter_notification_user'),
    ]

    operations = [
        migrations.RenameField(
            model_name='notification',
            old_name='created_at',
            new_name='timestamp',
        ),
    ]
