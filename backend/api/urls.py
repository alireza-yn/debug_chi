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
from questions.views import *
from followers.views import *
from post.views import *
from payments.views import *
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
router.register(r'user_portfolio', UserPortfolioViewSet, basename='UserPortfolio')
router.register(r'user_portfolio_image', UserPortfolioImageViewSet, basename='UserPortfolioImage')
router.register(r'job_history', UserJobHistoryViewSet, basename='UserJobHistory')



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
router.register(r'project_image',ProjectImageViewSet,basename='project_image')
# router.register(r'bid_project',BidProjectViewSet,basename='bid_project')

#endregion

#region ConsultHub Router
router.register(r'consult-hub', ConsultHubView,basename="consult-hub")
router.register(r'debug-hub', DebuggerHubView,basename="debug-hub")
#endregion



#region Management Router

#endregion

#region Follower Router
router.register(r'followers',FollowerViewSet,basename='دنبال کنندگان')
router.register(r'comments',UserCommentsViewSet,basename='کامنت ها')
#endregion



#region Question
router.register(r'questions',QuestionView,basename='پرسش سوال')
router.register(r'category',CategoryView,basename='دسته بندی')
router.register(r'answers',AnswersView,basename='پایسخ سوالات')
router.register(r'section',SectionView,basename='سکشن')
#endregion


#region Posts Router
router.register(r'posts',PostsViewSet,basename='پست آموزشی'),
router.register(r'post_group',PostListModelViewSet,basename='پست های من'),
router.register(r'comments',CommentViewSet,basename='کامنت ویدیوی آموزشی'),
router.register(r'Like',LikedPostViewSet,basename='لایک ویدیوی آموزشی'),
#endregion

#paymen Region
router.register(r'payment_withdraw',WithDrawViewSet,basename='برداشت اعتبار')
#endregion




#UserResume Region
router.register(r'foriegn_language',viewset=UserForeignLanguageViewSet,basename='foriegn_language')
#endregion


urlpatterns = [
    path('v1/',include(router.urls)),
    path('v1/test-upload/',TestUploadView.as_view(),name='test-upload'),
    path('v1/user-by-role/',UsersByRoleListView.as_view(),name='user-by-role'),
    path('v1/user-info/<uuid:uuid>/', GetUserInfoByUUID.as_view(), name='get-user-info'),
    path('v1/get-user-consult/',DebuggerApplicatorView.as_view(),name='get-user-consult'),
    path('v1/get-request-debug/',RequestDebugeFromUsers.as_view(),name='get-request-debug'),
    path('v1/get-user-debug/',UserOpendDebugList.as_view(),name='get-user-debug'),
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    path('v1/text_to_speech/',TextToSpeech.as_view(),name="text_to_speech"),
    #region  ConsultantAPI
    path('v1/programming-list/',ProgrammingLanguageList.as_view(),name='programming-list'),
    path('v1/programming-language/',ProgrammingList.as_view(),name='list'),
    #endregion 
    
    
    #region  ConsultantAPI
    path('v1/debug/accept_debug_session/',view=AcceptDebugSession.as_view(),name='قبول کردن جلسه دیباگ'),
    path('v1/debug/open_debug_session/',view=OpenedDebugSession.as_view(),name='open_debug_session'),
    path('v1/debug/get_pending_session/',view=PendingSession.as_view(),name='لیست جلسات در حال بررسی'),
    path('v1/debug/list_debug/',view=GetDebugerSession.as_view(),name='قبول کردن جلسه دیباگ'),
    path('v1/debug/get-session-info/<str:session_id>/',view=GetSessionInfo.as_view(),name='get-session-info'),
    path('v1/get-request/',view=GetDebugerRequest.as_view(),name='get-request'),
    path('v1/lock-session/',view=LockSession.as_view(),name='lock-session'),
    path('v1/close-session/',view=CloseSession.as_view(),name='close-session'),
    path('v1/reject-session/',view=RejectSession.as_view(),name='reject-session'),
    path('v1/reject-session/',view=SessionHandlerAPIView.as_view(),name="handle-session"),

    #endregion 
    
    
    #region Project

    path('v1/tender/',TenderProjectListView.as_view(),name='tender_info'),
    path('v1/tender_list/',ShowTenderProject.as_view(),name='tender_list'),
    path('v1/bids_tender_list/',GetBidTender.as_view(),name='bid_tender_list'),
    path('v1/submit_bid/',BidProjectAPIView.as_view(),name='submit_bid'),
    path('v1/like_tender/<str:tender_uuid>/',TenderLikeHandlerAPIView.as_view(), name='like_tender'),
    path('v1/get_all_class/',GetAllClassDetails.as_view(), name='all_class'),
    path('v1/get_all_tender_class/',EducationTenderListView.as_view(), name='tender_class'),
 
    #endregion
    
    #region question
        path('questions/', CategoryDetailAPIView.as_view(), name='category-detail'),
    #endregion


    #region Posts
        path('v1/get_post/', UserPostList.as_view(), name='user-post'),
        path('v1/like_post/', PostActionApiView.as_view(), name='user-post-action'),
        path('v1/user/<str:uuid>/', GetUserInfoAndPost.as_view(), name='user-profile'),
    #endregion

    #region report
        path('v1/report/',include('report.urls')),
    #endregion

    #region payment
        path('v1/payment_withdraw_view/',view=WithDrawApiView.as_view(),name="برداشت"),

    #endregion 
    



    #region language
    path('v1/add_language/',view=AddLanguageForUser.as_view(),name="add-language")
    #endregion

]