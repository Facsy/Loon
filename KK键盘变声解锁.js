#!name=KK键盘变声解锁
#!desc=解锁无限变声功能
#!openUrl=https://apps.apple.com/app/id1369910370
#!icon=https://raw.githubusercontent.com/Facsy/Loon/refs/heads/main/icon/KK键盘.png
#!homepage=https://github.com/Facsy/Loon
#!author=Facsy

[Rewrite]
^https?:\/\/kk\.weshine\.im\/v1\.0\/text2voice\/(checkCount|consumeCount) response-body-json-jq '.data.totalCount = 999 | .data.currCount = 999'
^https?:\/\/kk\.weshine\.im\/v1\.0\/text2voice\/createTtsAudio response-body-json-jq '.data.freeCount = 999'

[MITM]
hostname=kk.weshine.im
