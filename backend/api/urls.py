from rest_framework.routers import DefaultRouter
from django.urls import path,include
from management.views import * 
from tasks.views import *
from programming_language.views import *
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from .views import * 
from user_resume.views import *
from projects.views import *
from ConsultHub.views import *




router = DefaultRouter()
router.register('project',viewset=ProjectViewSet)
router.register('team_project',viewset=ProjectTeamViewSet)
router.register('tasks',viewset=TaskViewSet)

#region UserResume Router
router.register(r'user-resumes', UserResumeViewSet)
router.register(r'video-resumes', VideoResumeViewSet)
router.register(r'user-languages', UserLanguageViewSet)
router.register(r'user-skills', UserSkillViewSet)
router.register(r'user-degrees', UserDegreeViewSet)
router.register(r'user-social-media-links', UserSocialMediaLinksViewSet)
router.register(r'user-expertise', UserExpertiseViewSet)
router.register(r'add_resume', AddUserResume, basename='add_resume')

#endregion



#region ProgrammingLanguage Router
router.register(r'programming-languages', ProgrammingLanguageViewSet)
router.register(r'programmer-skills', ProgrammerSkillViewSet)
router.register(r'programmer-exprertise', ProgrammerExpertiseViewSet)
#endregion


#region project router
router.register(r'create_project', ProjectViewSet,basename="project_created")
router.register(r'new_project', CreateProjectAPIView,basename="new_project")
router.register(r'tender_project',TenderProjectViewSet,basename='tender_project')
router.register(r'bid_project',BidProjectViewSet,basename='bid_project')

#endregion


#region ConsultHub Router
router.register(r'consult-hub', ConsultHubView,basename="consult-hub")
router.register(r'debug-hub', DebuggerHubView,basename="debug-hub")
#endregion



#region Management Router

#endregion


urlpatterns = [
    path('v1/',include(router.urls)),
    path('v1/user-by-role/',UsersByRoleListView.as_view(),name='user-by-role'),
    path('v1/get-user-info/',GetUserInfo.as_view(),name='get-user-info'),
    path('v1/get-user-consult/',DebuggerApplicatorView.as_view(),name='get-user-info'),
    path('v1/get-request-debug/',RequestDebugeFromUsers.as_view(),name='get-request-debug'),
    path('v1/get-user-debug/',UserOpendDebugList.as_view(),name='get-user-debug'),
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
     #region  ConsultantAPI
    path('v1/programming-list/',ProgrammingLanguageList.as_view(),name='programming-list'),
    #endregion 
    
    
    #region  ConsultantAPI
    path('v1/debug/accept_debug_session/',view=AcceptDebugSession.as_view(),name='قبول کردن جلسه دیباگ'),
    path('v1/debug/list_debug/',view=GetDebugerSession.as_view(),name='قبول کردن جلسه دیباگ'),
    #endregion 
    
    
    #region TenderProject
    path('v1/tender/',TenderProjectListView.as_view(),name='tender_info'),
    #endregion
    
    
]