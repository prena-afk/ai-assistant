from django.urls import path
from . import views

urlpatterns = [
    path('leads', views.LeadListCreateView.as_view(), name='lead-list'),
    path('leads/stats', views.lead_stats, name='lead-stats'),
    path('leads/upload', views.upload_leads_csv, name='lead-upload'),
    path('leads/<int:pk>', views.lead_detail, name='lead-detail'),
]

