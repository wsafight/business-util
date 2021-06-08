# 通过灭霸脚本学 shell

```sh
#!/bin/sh
let "i=`find . -type f | wc -l`/2";
if [[ uname=="Darwin" ]]; then
    find . -not -name "Thanos.sh" -type f -print0 | gshuf -z -n $i | xargs -0  -- cat;
else
    find . -not -name "Thanos.sh" -type f -print0 | shuf -z -n $i | xargs -0  -- cat;
fi
```