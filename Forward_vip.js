#!name = Forward_vip
#!desc = 最高支持1.3.13
#!icon= https://raw.githubusercontent.com/Facsy/Loon/refs/heads/main/icon/Forward1.png
  
[Rewrite]
^https:\/\/fluxapi\.vvebo\.vip\/v1\/(purchase\/iap\/subscription) header https://mock.forward1.workers.dev/forward/v1/$1


[MITM]
hostname = fluxapi.vvebo.vip
