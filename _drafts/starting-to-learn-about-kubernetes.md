this has been a long time coming, but a project that i am working on will be using kubernetes
bare metal servers
while i am a huge proponent for serverless and lambda, there is no better option in my opinion
containers and kubernetes will allow us to modularize code and implement devops practices easier than the alternative which would be building VMs or running code on the bare metal which sounds archaic

setting this all up was much easier than i thought it would be
i used a k8s distro called k3s which was created and is maintained by rancher
i ran a one line shell command that they provided which downloaded and installed k3s
after that script my commodity server running Ubuntu was operating as a single node k8s cluster

*write a paragraph about k3s*