# -*- coding: utf-8 -*-
#########################################################################
#
# Copyright (C) 2016 OSGeo
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.
#
#########################################################################

from django.conf.urls import url, include

from geonode.urls import urlpatterns
from decat_geonode.wps.urls import urlpatterns
from decat_geonode.views import (router,
                                 annotations_global_router,
                                 cops_router,
                                 index_view,
                                 user_view, data_scope_view,
                                 group_member_role_view,
                                 data_scope_api_view,
                                 model_run_start,)



decat_urls = [
        url(r'^data_scope/(?P<group_id>[\d]+)/$', data_scope_view, name='data_scope'),
        url(r'^member_role/(?P<group_id>[-\w\d]+)/(?P<user>[-\w\d]+)/$', group_member_role_view, name='group_member_role'),
        url(r'^api/user/$', user_view, name='user'),
        url(r'^$', index_view, name='index'),

]

api_urls = [
        url('^data_scope/', data_scope_api_view, name='data_scope'),
        url(r'^model_run_start/(?P<pk>\d+)/$', model_run_start, name='model_run_start'),
]

urlpatterns += (
            url(r'^decat/api/', include(
                router.urls + api_urls + cops_router.urls + annotations_global_router.urls,
                namespace='decat-api')),
            url(r'^decat/', include(decat_urls, namespace='decat')),
                )
