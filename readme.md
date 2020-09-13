This simple proxy used for using sharepoint web services on hosts other than sharepoint itself to overcome CORS issues. it tested on sharepoint 2016 SP1 with both NTLM and Basic Authentication Modes

You first should add some custom response headers and rewrite rule for sharepoint site on iis using url rewrite module according to this link:
https://techcommunity.microsoft.com/t5/sharepoint-developer-blog/fixing-issue-in-making-cross-domain-ajax-call-to-sharepoint-rest/ba-p/510001
