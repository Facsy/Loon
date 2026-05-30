#!name=iOS证书验证状态屏蔽
#!desc=iOS证书验证状态屏蔽
#!author=Salem
#!icon=https://raw.githubusercontent.com/Facsy/Loon/refs/heads/main/icon/iPhone设置.png
#!homepage=https://github.com/salem-2007/apple-cert-block
#!openUrl=https://t.me/LKm0907
#!tag=Apple,Certificate,AntiRevoke
#!loon_version=3.2.0
#!system=ios
#!update-url=https://raw.githubusercontent.com/salem-2007/apple-cert-block/main/AntiRevoke.plugin

[Rule]
# Apple OCSP
DOMAIN,ocsp.apple.com,REJECT
DOMAIN,ocsp2.apple.com,REJECT
# Apple Validation
DOMAIN,valid.apple.com,REJECT
DOMAIN,ppq.apple.com,REJECT
DOMAIN,ppq-ext.v.aaplimg.com,REJECT
# Apple CRL
DOMAIN,crl.apple.com,REJECT
DOMAIN,certs.apple.com,REJECT
# DigiCert
DOMAIN,ocsp.digicert.com,REJECT
DOMAIN,ocsp.digicert.cn,REJECT
DOMAIN,crl3.digicert.com,REJECT
DOMAIN,crl4.digicert.com,REJECT
# Entrust
DOMAIN,ocsp.entrust.net,REJECT
DOMAIN,crl.entrust.net,REJECT
# Sectigo / USERTrust
DOMAIN,ocsp.sectigo.com,REJECT
DOMAIN,crl.sectigo.com,REJECT
DOMAIN,ocsp.usertrust.com,REJECT
DOMAIN,crl.usertrust.com,REJECT

[MITM]
hostname=%APPEND% ocsp.apple.com, ocsp2.apple.com, valid.apple.com
