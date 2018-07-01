# Generated by Django 2.0.6 on 2018-07-01 12:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='pagecategory',
            name='text',
            field=models.TextField(blank=True, help_text="You can use <a href='http://commonmark.org/help/'>MarkDown</a> here"),
        ),
        migrations.AlterField(
            model_name='page',
            name='slug',
            field=models.SlugField(help_text="Used in page's URL", max_length=100),
        ),
        migrations.AlterField(
            model_name='page',
            name='text',
            field=models.TextField(help_text="You can use <a href='http://commonmark.org/help/'>MarkDown</a> here"),
        ),
        migrations.AlterField(
            model_name='page',
            name='visible',
            field=models.BooleanField(default=True, help_text='Visible on list'),
        ),
        migrations.AlterField(
            model_name='pagecategory',
            name='slug',
            field=models.SlugField(help_text="Used in page's URL", max_length=100, unique=True),
        ),
    ]