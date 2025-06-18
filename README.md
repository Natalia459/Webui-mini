# Webui-mini

### Настройка окружения для интеграции веб-приложения
Для работы была собрана OpenBMC, сконфигурированная под сервер компании IBM, palmetto, запущена на эмуляторе QEMU. Для сборки нужно склонировать официальный репозиторий OpenBMC: https://github.com/openbmc/openbmc и выполнить настройку под требуемую машину. 

#### Ubuntu: предварительная настройка

[](https://github.com/openbmc/openbmc#ubuntu)

```shell
sudo apt install git gcc g++ make file wget \
    gawk diffstat bzip2 cpio chrpath zstd lz4 bzip2
```

#### Fedora: предварительная настройка

[](https://github.com/openbmc/openbmc#fedora)

```shell
sudo dnf install git python3 gcc g++ gawk which bzip2 chrpath cpio \
    hostname file diffutils diffstat lz4 wget zstd rpcgen patch
```
#### Склонировать репозиторий
```bash
git clone https://github.com/openbmc/openbmc
cd openbmc
```
#### Настроить машину
```bash
. setup palmetto
```
#### Собрать образ
```bash
bitbake obmc-phosphor-image
```

#### Запуск OpenBMC на QEMU
Запуск осуществляется с собранным образом операционной системы для palmetto с помощью последней версии приложения qemu-system-arm, доступного по ссылке: https://jenkins.openbmc.org/job/latest-qemu-x86/lastSuccessfulBuild/artifact/qemu/build/qemu-system-arm из командной строки под операционный системой Linux (данная работа выполнялась на Ubuntu 24.04.2 LTS):

```bash
./qemu-system-arm -m 256 -M palmetto-bmc -nographic \
-drive file=./obmc-phosphor-image-palmetto.static.mtd, format=raw, if=mtd \
-net nic \
-net user, hostfwd=:127.0.0.1:2222-:22, hostfwd=:127.0.0.1:2443-:443, hostfwd=udp:127.0.0.1:2623-:623, hostname=qemu.
```


### Описание структуры сайта
Для доступа к управлению BMC нужно ввести в поисковую строку URI: https://<IP-адрес-BMC:порт>/ в случае, когда операционная система запускается на эмуляторе QEMU, на месте IP-адреса будет localhost.
#### Страница авторизации
![Image authorization](https://github.com/frogerok/Webui-mini/blob/main/readme_fotos/authorization.png)
При попытке оставить поле логина или пароля пустыми выведется предупредительное сообщение: ”This field is required”. При неправильном вводе пароля выведется alarm-сообщение об ошибке
#### Начальная страница
![Image overview](https://github.com/frogerok/Webui-mini/blob/main/readme_fotos/overview.png)
На начальной странице предоставлена основная информация о BMC, о текущем пользователе и машине (BMC base system information), сетевых настройках (BMC base network information) и наличии ошибок на устройстве (BMC status).

Также в хедере есть все реализованные функции управления: перезагрузка BMC, информация о сессиях, политиках подключений, сетевых настройках и дате с временем.



#### Перезагрузка BMC
![Image reboot BMC](https://github.com/frogerok/Webui-mini/blob/main/readme_fotos/reboot_bmc.png)
При нажатии на первый пункт главного меню выводится время последней перезагрузки системы и кнопка для запуска этого процесса в реальном времени с предупреждением о том, что на время перезагрузки браузер потеряет контакт с BMC и сайт может отключиться. Потом может потребоваться заново авторизироваться.
#### Открытые сессии
![Image sessions](https://github.com/frogerok/Webui-mini/blob/main/readme_fotos/sessions.png)
При выборе пункта “Sessions” выводится информация о текущих сессиях c идентификатором, именем пользователя и IP-адреса, с которого произошло подключение
#### Политики подключения
![Image policies](https://github.com/frogerok/Webui-mini/blob/main/readme_fotos/policies.png)
При выборе “Policies” можно получить сведения о возможности подключения с помощью SSH или отправке запросов по IPMI и длительности веб-сессии, а также отредактировать их
#### Сетевые настройки
![Image network settings](https://github.com/frogerok/Webui-mini/blob/main/readme_fotos/network_settings.png)
При выборе “Network” выведется информация о сетевых настройках: FQDN, MAC-, IPv4-, IPv6-адресах и возможности их получения с помощью DHCP
#### Настройки даты и времени
![Image date and time](https://github.com/frogerok/Webui-mini/blob/main/readme_fotos/date_time.png)
При нажатии на “Date and time” можно увидеть дату и время, установленные на BMC

### Демонстрация интерактивного функционала приложения

1.                  Возможность запретить подключения по SSH или IPMI

######  Отключение подключения по SSH
![Image turn off ssh](https://github.com/frogerok/Webui-mini/blob/main/readme_fotos/turn_off_ssh.png)
Нужно нажать на ползунок в соответствующей настройке

При запрете подключения по SSH спустя небольшое время текущие подключения будут прекращены:
###### Ошибка при подключении по SSH
![Image error ssh connection](https://github.com/frogerok/Webui-mini/blob/main/readme_fotos/ssh_sessions_blocked.png)

2.                  Перезагрузка

Приложение попросит подтвердить операцию

###### Подтверждение перезагрузки BMC
![Image confiirm reboot](https://github.com/frogerok/Webui-mini/blob/main/readme_fotos/confirm_reboot.png)
После подтверждения запустит процесс перезагрузки

###### Начало перезагрузки BMC
![Image reboot started](https://github.com/frogerok/Webui-mini/blob/main/readme_fotos/reboot_started.png)
3.                  Добавление других открытых сессий

Для примера подключимся из трех браузеров
###### Данные о сессиях BMC
![Image sessions](https://github.com/frogerok/Webui-mini/blob/main/readme_fotos/sessions_triple.png)
###### Открытые страницы
![Image opened sessions](https://github.com/frogerok/Webui-mini/blob/main/readme_fotos/brousers.png)

4.                  Изменение даты на BMC

В данном случае изменяем время непосредственно на BMC и смотрим изменения в веб-приложении
###### Изменение времени BMC
![Image change time](https://github.com/frogerok/Webui-mini/blob/main/readme_fotos/change_time_terminal.png)
###### Страница с изменившимся временем BMC
![Image check changes](https://github.com/frogerok/Webui-mini/blob/main/readme_fotos/change_time_web.png)

### Описание используемых технологий и фреймворков

При проектировании веб-приложения я приняла решение отказаться от реализации с использованием чистых HTML и JavaScript в пользу Vue.js по следующим причинам:

·                    JavaScript не предоставляет готовых решений для работы с API и состоянием, а их написание в десятки раз увеличивает кодовую базу проекта, что неразумно при наличии готового решения

·                    Даже в случае написания собственных классов, функций и т.д. встает вопрос о совместимости с OpenBMC, поскольку переписывание бэкэнда в виде сервиса bmcweb выходит за рамки текущего проекта

·                    Vue.js предоставляет средства реактивности, что значительно ускоряет разработку, так как в наличии уже есть UI для автообновления и изменения данных BMC

При выборе версии фреймворка Vue.js я остановилась на третьей вместо реализованной в Webui-vue второй. Аргументы в пользу такого выбора:

·                    Новый рендер-движок на основе Virtual DOM с tree-shaking (удаление неиспользуемого кода при сборке).

·                    До 2× быстрее обновление компонентов (актуально для реального времени: мониторинг датчиков, логи).

·                    Composition API вместо Options API в Vue 2, что позволяет группировать код по функциональности (а не по типам методов, параллельно повышая читаемость

·                    Меньший размер файлов при production сборке

·                    Поддержка Vue 2 официально прекращена с 2024 года, что означает отсутствие обновлений с исправлением и улучшением функциональности

Помимо этого, вместо Webpack для сборки и тестирования проекта на dev-сервере был выбран Vite, потому что он упрощает написание конфига, автоматически автоматизирует сборку для production версии и автоматически разделяет код на чанки без дополнительной настройки, которую требует Webpack. Также последний не идельно интегрируется с Vue 3, требуя vue-loader и дополнительные плагины.

Для отправки запросов на сервер используется Axios - HTTP-клиент для JavaScript, который упрощает работу с API, для упрощения совместимости с bmcweb (OpenBMC). Для корректной работы cookie подключен js-cookie.

Для хранения состояний системы используется Vuex, так как у некоторых компонентов есть общие данные, которые можно было бы загружать единожды до обновления. Кроме того, Vuex упрощает валидацию запросов, которая необходима для реализации заявленного в данной работе функционала веб-приложения.

Для перемещения между страницами внедрен Vue-Router, чтобы страница не перезагружалась каждый раз при нажатии на пункты главного меню.

Для корректной обработки запросов со стороны backend сервиса используется HTTPS протокол с автоматически сгенерированными ключами безопасности, что имеет и неприятное последствие: браузер при первом открытии страницы предупреждает о ненадежности соединения.

Из-за специфики OpenBMC все изображения вставляются в виде кода в место их вызова в JavaScript с помощью vite-svg-loader.

Одной из возможностей веб-приложения является предоставление данных о дате и времени на BMC. Для их парсинга используется date-fns-tz
