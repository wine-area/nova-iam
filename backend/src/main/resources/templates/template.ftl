<!DOCTYPE html>
<html<#if locale??> lang="${locale.toLanguageTag()}"</#if>>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    
    <#if properties.meta?has_content>
        <#list properties.meta?split(' ') as meta>
            <meta name="${meta?split('==')?first}" content="${meta?split('==')?last}"/>
        </#list>
    </#if>
    
    <title>${msg("loginTitle",(realm.displayName!''))}</title>
    
    <#if properties.favIconUrl?has_content>
        <link rel="icon" href="${properties.favIconUrl}">
    </#if>
    
    <#if properties.stylesCommon?has_content>
        <#list properties.stylesCommon?split(' ') as style>
            <link href="${url.resourcesCommonPath}/${style}" rel="stylesheet" />
        </#list>
    </#if>
    
    <#if properties.styles?has_content>
        <#list properties.styles?split(' ') as style>
            <link href="${url.resourcesPath}/${style}" rel="stylesheet" />
        </#list>
    </#if>
    
    <#if properties.scripts?has_content>
        <#list properties.scripts?split(' ') as script>
            <script src="${url.resourcesPath}/${script}" type="text/javascript"></script>
        </#list>
    </#if>
    
    <style>
        .login-pf body {
            background: ${properties.backgroundColor!'-webkit-radial-gradient(center, ellipse cover, #1e5799 0%, #2989d8 50%, #207cca 51%, #7db9e8 100%)'};
            background: ${properties.backgroundColor!'-moz-radial-gradient(center, ellipse cover, #1e5799 0%, #2989d8 50%, #207cca 51%, #7db9e8 100%)'};
            background: ${properties.backgroundColor!'-ms-radial-gradient(center, ellipse cover, #1e5799 0%, #2989d8 50%, #207cca 51%, #7db9e8 100%)'};
            background: ${properties.backgroundColor!'radial-gradient(ellipse at center, #1e5799 0%, #2989d8 50%, #207cca 51%, #7db9e8 100%)'};
        }
        
        <#if properties.primaryColor?has_content>
        .btn-primary {
            background-color: ${properties.primaryColor};
            border-color: ${properties.primaryColor};
        }
        .btn-primary:hover,
        .btn-primary:focus,
        .btn-primary:active {
            background-color: ${properties.primaryColor};
            border-color: ${properties.primaryColor};
            opacity: 0.8;
        }
        </#if>
        
        <#if properties.logoUrl?has_content>
        .kc-logo-text {
            background-image: url('${properties.logoUrl}');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            text-indent: -9999px;
            height: 100px;
        }
        </#if>
    </style>
</head>

<body class="login-pf">
    <div class="login-pf-page">
        <div id="kc-header" class="login-pf-page-header">
            <div id="kc-header-wrapper" class="${properties.kcHeaderWrapperClass!}">
                <#if properties.logoUrl?has_content>
                    <div class="kc-logo-text">${kcSanitize(msg("loginTitleHtml",(realm.displayNameHtml!'')))?no_esc}</div>
                <#else>
                    ${kcSanitize(msg("loginTitleHtml",(realm.displayNameHtml!'')))?no_esc}
                </#if>
            </div>
        </div>
        
        <div class="card-pf">
            <header class="login-pf-header">
                <#if realm.internationalizationEnabled>
                    <div class="kc-locale">
                        <div class="kc-locale-name">
                            <#list locale.supported as l>
                                <#if l.languageTag == locale.current>
                                    ${l.label}
                                </#if>
                            </#list>
                        </div>
                        <div class="kc-locale-dropdown">
                            <#list locale.supported as l>
                                <#if l.languageTag != locale.current>
                                    <a href="${l.href}">${l.label}</a>
                                </#if>
                            </#list>
                        </div>
                    </div>
                </#if>
                
                <h1 id="kc-page-title">
                    <#nested "header">
                </h1>
            </header>
            
            <div id="kc-content">
                <div id="kc-content-wrapper">
                    <#nested "form">
                    
                    <#if auth?has_content && auth.showTryAnotherWayLink()>
                        <form id="kc-select-try-another-way-form" action="${url.loginAction}" method="post">
                            <div class="${properties.kcFormGroupClass!}">
                                <input type="hidden" name="tryAnotherWay" value="on"/>
                                <a href="#" id="try-another-way"
                                   onclick="document.forms['kc-select-try-another-way-form'].submit();return false;">${msg("doTryAnotherWay")}</a>
                            </div>
                        </form>
                    </#if>

                    <#nested "socialProviders">
                </div>
            </div>
        </div>
        
        <div class="login-pf-page-footer">
            <#nested "info">
        </div>
    </div>
</body>
</html>