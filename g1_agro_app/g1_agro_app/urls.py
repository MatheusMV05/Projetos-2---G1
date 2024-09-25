from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', include('ryb_agro_app.urls')),
]
