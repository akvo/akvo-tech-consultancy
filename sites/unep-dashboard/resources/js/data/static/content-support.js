import React, { Component, Fragment } from "react";

export const links = {
    videoDemo: "https://player.vimeo.com/video/451466296",
};

export const qna = {
    ar : [
        {
            q: "ما هي البيانات الممثلة في لوحة القيادة والمستودع؟",
            a: <Fragment>
                <p className="text-right">تم جمع البيانات بشكل أساسي من خلال استطلاع رأي عبر الإنترنت ، وقد تم تصميم الاستطلاع عبر الإنترنت ليتم إكماله (طوعًا) بواسطة <i> 'الحكومات والصكوك الإقليمية والعالمية والمنظمات الدولية والقطاع الخاص والمنظمات غير الحكومية والمساهمين الآخرين المعنيين' (<strong>UNEEP/EA.4/Res .6OP 7a</strong>) لالتقاط الإجراءات والأنشطة الحالية التي تحدث من January 1<cite>st</cite> 2018 و "اتخذ للحد من النفايات البلاستيكية البحرية والمواد البلاستيكية الدقيقة بهدف القضاء على المدى الطويل على التصريف في المحيطات' </i>.</p>
                <p className="text-right">تم تصميم الاستطلاع بحيث يكون لكل إرسال تركيز على إجراء واحد. على نحو فعال ، كان الإجراء هو وحدة البيانات (وليس المنظمة). يمكن لكل مستجيب تقديم العديد من الإجراءات من خلال إكمال الاستبيان في مناسبات متكررة.</p>
                <p className="text-right">بالإضافة إلى الدراسة الاستقصائية ، يمكن للكيانات أن تقدم إلى التقييم باستخدام الطريقة التي تم تطويرها بالفعل من قبل نهج مجموعة العشرين ، من خلال توفير خيار استجابة تقديم سردي باستخدام نفس النموذج. تمت إضافة العروض السردية إلى منصة المستودع عبر الإنترنت.</p>
                <p className="text-right">يمكن العثور على وصف تفصيلي لمنهجية جمع البيانات <a href="https://papersmart.unon.org/resolution/uploads/guidelines_for_marine_plastic_litter_stocktake_survey_2_hs1.pdf" target="_blank" className="bold">هنا</a>.</p>
            </Fragment>,
            l: false,
        }, {
            q: "لماذا توجد لوحة معلومات تفاعلية ومنصة مستودع عبر الإنترنت؟",
            a: <p className="text-right">لتمكين الوصول إلى ملفات <a className="bold" href="https://wedocs.unep.org/bitstream/handle/20.500.11822/28471/English.pdf" target="_blank">جرد الإجراءات العالمية للحد من تدفق البلاستيك البحري والبلاستيك البحري إلى المحيطات</a> للاستخدام العام ، تم تطوير منتجين. تهدف لوحة القيادة إلى تلخيص نتائج الاستطلاع بشكل مرئي ، في حين أن الهدف الرئيسي للمستودع هو تخزين معلومات إضافية عن كل إجراء فردي.</p>,
            l: [
                <p className="text-right">أنت تزور حاليًا لوحة القيادة التفاعلية. تحتوي لوحة القيادة على جميع الإجراءات المبلغ عنها عبر الاستطلاع عبر الإنترنت. الهدف من لوحة القيادة هو تمثيل بيانات المسح بشكل مرئي على عدد من السمات الرئيسية. تتيح لوحة القيادة أيضًا المقارنة على مستوى البلد / المنطقة وتنزيل العناصر المرئية.</p>,
                <p className="text-right">يمكن الوصول إلى منصة المستودع عبر الإنترنت <a className="bold" href="https://unep.akvoapp.org/project-directory/unep" target="_blank">هنا</a>. يحتوي المستودع على جميع الإجراءات المبلغ عنها عبر الاستبيان عبر الإنترنت والتقديمات السردية. يمكن تطبيق عدد من عوامل التصفية المخصصة للبحث عن الإجراءات الفردية. بناءً على ذلك ، يمكن للمستخدمين زيارة صفحات الإجراءات الفردية لقراءة ملخص والوصول إلى معلومات إضافية حول كل إجراء ، مثل التقارير بتنسيق PDF أو مواقع الويب المقابلة.</p>
            ]
        }, {
            q: "لمن هي لوحة القيادة والمستودع؟",
            a: <p className="text-right">كل من لوحة القيادة والمستودع متاحان للجمهور. أي شخص مهتم بالإجراءات العالمية للحد من تدفق البلاستيك البحري والجزيء البلاستيكي إلى المحيطات. يمكن للمستخدمين على سبيل المثال أن يكونوا صانعي السياسات والباحثين والطلاب.</p>,
            l: false,
        }, {
            q: "متى يتم بناء لوحة القيادة والمستودع؟",
            a: <p className="text-justify">بدأ مشروع بناء لوحة القيادة والمستودع في نهاية عام 2019 وتم نشر كلا المنتجين على الإنترنت في سبتمبر 2020 باللغة الإنجليزية. تنفيذ جميع لغات الأمم المتحدة الست قيد الإنشاء حاليًا.</p>,
            l: false,
        }
    ],

    en : [
        {
            q: "What data is represented in the dashboard and the repository?",
            a: <Fragment>
                <p className="text-justify">The data has been mainly collected through an online stock-taking survey.The online survey was designed to be completed (voluntarily) by <i> 'governments, regional and global instruments, international organizations, the private sector, non-governmental organizations and other relevant contributors' (<strong>UNEEP/EA.4/Res .6OP 7a</strong>) to, capture existing actions and activities happening from January 1<cite>st</cite> 2018 and 'taken to reduce marine plastic litter and micro plastics with the aim of the long term elimination of discharge into the oceans' </i>.</p>
                <p className="text-justify">The survey was designed so that each submission had a focus of one action. Effectively, the action was the data unit(not the organization).Each respondent could submit many actions by completing the survey on repeated occasions.</p>
                <p className="text-justify">As well as a survey, entities could submit to the stocktake using method already developed by the Group of 20 approach, by having a narrative submission response option available using the same template. The narrative submissions have been added to the online repository platform.</p>
                <p className="text-justify">A detailed description of the methodology of the data collection can be found <a href="https://papersmart.unon.org/resolution/uploads/guidelines_for_marine_plastic_litter_stocktake_survey_2_hs1.pdf" target="_blank" className="bold">here</a>.</p>
            </Fragment>,
            l: false,
        }, {
            q: "Why is there an interactive dashboard and an online repository platform?",
            a: <p className="text-justify">To enable access to <a className="bold" href="https://wedocs.unep.org/bitstream/handle/20.500.11822/28471/English.pdf" target="_blank">the stocktake of global actions to reduce the flow of marine plastic and microplastic to the oceans</a> for public use, two products have been developed. The dashboard aims to visually summarise the survey results, whereas the main goal of the repository is to store additional information on each individual action.</p>,
            l: [
                <p className="text-justify">You are currently visiting the interactive dashboard. The dashboard contains all reported actions via the online survey. The aim of the dashboard is to visually represent the survey data on a number of key attributes. The dashboard also allows for comparison on country/region level and downloading of the visuals.</p>,
                <p className="text-justify">The online repository platform can be accessed <a className="bold" href="https://unep.akvoapp.org/project-directory/unep" target="_blank">here</a>. The repository contains all reported actions via the online survey and narrative submissions. A number of custom filters can be applied to search for individual actions. Thereon, users can visit pages of individual actions to read a summary and access additional information on each action, such as reports in PDF format or corresponding websites.</p>
            ]
        }, {
            q: "Who are the dashboard and the repository for?",
            a: <p className="text-justify">The dashboard and repository are both publicly available. Anyone with an interest in the global actions to reduce the flow of marine plastic and microplastic to the oceans. Users can for example be policy makers, researchers, students.</p>,
            l: false,
        }, {
            q: "When are the dashboard and the repository built?",
            a: <p className="text-justify">The project of building the dashboard and the repository started at the end of 2019 and both products have been published online in September 2020 in English. Implementation of all 6 UN languages is currently under construction.</p>,
            l: false,
        }
    ],

    es : [
        {
            q: "¿Qué datos están representados en el tablero y el repositorio?",
            a: <Fragment>
                <p className="text-justify">Los datos se han recopilado principalmente a través de una encuesta de balance en línea. La encuesta en línea fue diseñada para ser completada (voluntariamente) por <i> 'gobiernos, instrumentos regionales y mundiales, organizaciones internacionales, el sector privado, organizaciones no gubernamentales y otros contribuyentes pertinentes' (<strong>UNEEP/EA.4/Res .6OP 7a</strong>) para capturar las acciones y actividades existentes que ocurren desde January 1<cite>st</cite> 2018 y 'tomado para reducir la basura plástica marina y los microplásticos con el objetivo de la eliminación a largo plazo de la descarga en los océanos' </i>.</p>
                <p className="text-justify">La encuesta se diseñó para que cada presentación tuviera un enfoque de una acción. Efectivamente, la acción fue la unidad de datos (no la organización). Cada encuestado podía enviar muchas acciones completando la encuesta en repetidas ocasiones.</p>
                <p className="text-justify">Además de una encuesta, las entidades podrían presentar al inventario utilizando el método ya desarrollado por el enfoque del Grupo de los 20, al tener una opción de respuesta de presentación narrativa disponible utilizando la misma plantilla. Las presentaciones narrativas se han agregado a la plataforma del repositorio en línea.</p>
                <p className="text-justify">Puede encontrar una descripción detallada de la metodología de recolección de datos <a href="https://papersmart.unon.org/resolution/uploads/guidelines_for_marine_plastic_litter_stocktake_survey_2_hs1.pdf" target="_blank" className="bold">aquí</a>.</p>
            </Fragment>,
            l: false,
        }, {
            q: "¿Por qué hay un tablero interactivo y una plataforma de repositorio en línea?",
            a: <p className="text-justify">Para habilitar el acceso a <a className="bold" href="https://wedocs.unep.org/bitstream/handle/20.500.11822/28471/English.pdf" target="_blank">el balance de acciones globales para reducir el flujo de plástico marino y microplástico a los océanos</a> para uso público, se han desarrollado dos productos. El tablero tiene como objetivo resumir visualmente los resultados de la encuesta, mientras que el objetivo principal del repositorio es almacenar información adicional sobre cada acción individual.</p>,
            l: [
                <p className="text-justify">Actualmente está visitando el panel interactivo. El panel contiene todas las acciones informadas a través de la encuesta en línea. El objetivo del tablero es representar visualmente los datos de la encuesta en una serie de atributos clave. El tablero también permite la comparación a nivel de país / región y la descarga de imágenes.</p>,
                <p className="text-justify">Se puede acceder a la plataforma del repositorio en línea <a className="bold" href="https://unep.akvoapp.org/project-directory/unep" target="_blank">aquí</a>. El repositorio contiene todas las acciones informadas a través de la encuesta en línea y las presentaciones narrativas. Se pueden aplicar varios filtros personalizados para buscar acciones individuales. Allí, los usuarios pueden visitar páginas de acciones individuales para leer un resumen y acceder a información adicional sobre cada acción, como informes en formato PDF o sitios web correspondientes.</p>
            ]
        }, {
            q: "¿Para quién son el tablero y el repositorio?",
            a: <p className="text-justify">Tanto el panel como el repositorio están disponibles públicamente. Cualquiera que tenga interés en las acciones globales para reducir el flujo de plástico marino y microplástico a los océanos. Los usuarios pueden ser, por ejemplo, responsables políticos, investigadores, estudiantes.</p>,
            l: false,
        }, {
            q: "¿Cuándo se crean el tablero y el repositorio?",
            a: <p className="text-justify">El proyecto de construcción del tablero y el repositorio comenzó a fines de 2019 y ambos productos se publicaron en línea en septiembre de 2020 en inglés. La implementación de los 6 idiomas de la ONU está actualmente en construcción.</p>,
            l: false,
        }
    ],

    fr : [
        {
            q: "Quelles données sont représentées dans le tableau de bord et le référentiel?",
            a: <Fragment>
                <p className="text-justify">Les données ont été principalement collectées via une enquête d'inventaire en ligne. L'enquête en ligne a été conçue pour être complétée (volontairement) par <i> 'gouvernements, instruments régionaux et mondiaux, organisations internationales, secteur privé, organisations non gouvernementales et autres contributeurs pertinents' (<strong>UNEEP/EA.4/Res .6OP 7a</strong>) à, capturer les actions et activités existantes January 1<cite>st</cite> 2018 et «prises pour réduire les déchets plastiques marins et les micro-plastiques dans le but d'éliminer à long terme les rejets dans les océans' </i>.</p>
                <p className="text-justify">L'enquête a été conçue de manière à ce que chaque soumission se concentre sur une action. En fait, l'action était l'unité de données (et non l'organisation). Chaque répondant pouvait soumettre de nombreuses actions en répondant à l'enquête à plusieurs reprises.</p>
                <p className="text-justify">En plus d'une enquête, les entités pourraient se soumettre à l'inventaire en utilisant une méthode déjà développée par l'approche du Groupe des 20, en ayant une option de réponse de soumission narrative disponible en utilisant le même modèle. Les soumissions narratives ont été ajoutées à la plateforme de dépôt en ligne.</p>
                <p className="text-justify">Une description détaillée de la méthodologie de la collecte de données peut être trouvée <a href="https://papersmart.unon.org/resolution/uploads/guidelines_for_marine_plastic_litter_stocktake_survey_2_hs1.pdf" target="_blank" className="bold">ici</a>.</p>
            </Fragment>,
            l: false,
        }, {
            q: "Pourquoi existe-t-il un tableau de bord interactif et une plateforme de référentiel en ligne?",
            a: <p className="text-justify">Pour activer l'accès à <a className="bold" href="https://wedocs.unep.org/bitstream/handle/20.500.11822/28471/English.pdf" target="_blank">le bilan des actions mondiales pour réduire les flux de plastiques et microplastiques marins vers les océans</a> pour un usage public, deux produits ont été développés. Le tableau de bord vise à résumer visuellement les résultats de l'enquête, tandis que l'objectif principal du référentiel est de stocker des informations supplémentaires sur chaque action individuelle.</p>,
            l: [
                <p className="text-justify">Vous visitez actuellement le tableau de bord interactif. Le tableau de bord contient toutes les actions signalées via l'enquête en ligne. Le but du tableau de bord est de représenter visuellement les données d'enquête sur un certain nombre d'attributs clés. Le tableau de bord permet également une comparaison au niveau du pays / région et le téléchargement des visuels.</p>,
                <p className="text-justify">La plateforme de dépôt en ligne est accessible <a className="bold" href="https://unep.akvoapp.org/project-directory/unep" target="_blank">ici</a>. Le référentiel contient toutes les actions signalées via l'enquête en ligne et les soumissions narratives. Un certain nombre de filtres personnalisés peuvent être appliqués pour rechercher des actions individuelles. Là-dessus, les utilisateurs peuvent visiter des pages d'actions individuelles pour lire un résumé et accéder à des informations supplémentaires sur chaque action, telles que des rapports au format PDF ou des sites Web correspondants.</p>
            ]
        }, {
            q: "À qui sont destinés le tableau de bord et le référentiel?",
            a: <p className="text-justify">The dashboard and repository are both publicly available. Anyone with an interest in the global actions to reduce the flow of marine plastic and microplastic to the oceans. Users can for example be policy makers, researchers, students.</p>,
            l: false,
        }, {
            q: "Quand le tableau de bord et le référentiel sont-ils construits?",
            a: <p className="text-justify">Le projet de construction du tableau de bord et du référentiel a débuté fin 2019 et les deux produits ont été publiés en ligne en septembre 2020 en anglais. La mise en œuvre des 6 langues des Nations Unies est actuellement en cours de construction.</p>,
            l: false,
        }
    ],

    ru : [
        {
            q: "Какие данные представлены в дашборде и в репозитории?",
            a: <Fragment>
                <p className="text-justify">Данные собирались в основном с помощью онлайн-опроса по инвентаризации. Онлайн-опрос был разработан для заполнения (добровольно) <i> 'правительства, региональные и глобальные инструменты, международные организации, частный сектор, неправительственные организации и другие соответствующие участники' (<strong>UNEEP/EA.4/Res .6OP 7a</strong>) чтобы фиксировать существующие действия и действия, происходящие из January 1<cite>st</cite> 2018 и «приняты для уменьшения морского пластикового мусора и микропластика с целью долгосрочного устранения сброса в океаны».' </i>.</p>
                <p className="text-justify">Опрос был разработан таким образом, чтобы каждое сообщение было сосредоточено на одном действии. Фактически, действие было единицей данных (а не организацией). Каждый респондент мог представить множество действий, многократно заполняя опрос.</p>
                <p className="text-justify">Помимо опроса, предприятия могут подать заявку на инвентаризацию с использованием метода, уже разработанного Группой 20, с помощью варианта ответа с описательной отправкой, доступного с использованием того же шаблона. Описательные материалы были добавлены на платформу онлайн-хранилища.</p>
                <p className="text-justify">Подробное описание методологии сбора данных можно найти <a href="https://papersmart.unon.org/resolution/uploads/guidelines_for_marine_plastic_litter_stocktake_survey_2_hs1.pdf" target="_blank" className="bold">здесь</a>.</p>
            </Fragment>,
            l: false,
        }, {
            q: "Зачем нужна интерактивная панель управления и платформа онлайн-репозитория?",
            a: <p className="text-justify">Чтобы разрешить доступ к <a className="bold" href="https://wedocs.unep.org/bitstream/handle/20.500.11822/28471/English.pdf" target="_blank">подведение итогов глобальных действий по сокращению потока морского пластика и микропластика в океаны</a> для общественного пользования были разработаны два продукта. Панель управления предназначена для визуального обобщения результатов опроса, тогда как основная цель репозитория - хранить дополнительную информацию о каждом отдельном действии.</p>,
            l: [
                <p className="text-justify">В настоящее время вы посещаете интерактивную панель управления. Панель управления содержит все действия, о которых сообщалось в ходе онлайн-опроса. Цель панели управления - визуально представить данные опроса по ряду ключевых атрибутов. Панель управления также позволяет сравнивать на уровне страны / региона и загружать визуальные эффекты.</p>,
                <p className="text-justify">Доступ к платформе онлайн-репозитория можно получить <a className="bold" href="https://unep.akvoapp.org/project-directory/unep" target="_blank">здесь</a>. В репозитории содержатся все действия, о которых сообщалось в ходе онлайн-опроса и представлений. Для поиска отдельных действий можно применить ряд настраиваемых фильтров. После этого пользователи могут посещать страницы отдельных действий, чтобы прочитать сводку и получить доступ к дополнительной информации о каждом действии, такой как отчеты в формате PDF или соответствующие веб-сайты.</p>
            ]
        }, {
            q: "Для кого предназначен дашборд и репозиторий?",
            a: <p className="text-justify">Панель управления и репозиторий общедоступны. Всем, кто заинтересован в глобальных действиях по сокращению потока морского пластика и микропластика в океаны. Пользователи могут, например, быть политиками, исследователями, студентами.</p>,
            l: false,
        }, {
            q: "Когда строятся дашборд и репозиторий?",
            a: <p className="text-justify">Проект создания информационной панели и репозитория стартовал в конце 2019 года, и оба продукта были опубликованы в Интернете в сентябре 2020 года на английском языке. В настоящее время ведется работа по внедрению всех 6 языков ООН.</p>,
            l: false,
        }
    ],

    zh : [
        {
            q: "儀表板和存儲庫中代表什麼數據？",
            a: <Fragment>
                <p className="text-justify">數據主要是通過在線盤點調查收集的。在線調查旨在由（自願）完成 <i> '政府，區域和全球文書，國際組織，私營部門，非政府組織和其他相關貢獻者' (<strong>UNEEP/EA.4/Res .6OP 7a</strong>) 捕獲從中發生的現有動作和活動 January 1<cite>st</cite> 2018 為了減少長期排放到海洋中的目的，減少海洋塑料垃圾和微塑料' </i>.</p>
                <p className="text-justify">進行調查的目的是使每個提交都集中於一項行動。 實際上，行動是數據單位（而非組織）。每個受訪者可以通過重複完成調查來提交許多行動。</p>
                <p className="text-justify">除調查外，實體可以使用20國集團方法已經開發的方法提交盤點，方法是使用相同的模板提供敘述性提交回複選項。 敘述提交已添加到在線存儲庫平台。</p>
                <p className="text-justify">可以找到有關數據收集方法的詳細說明 <a href="https://papersmart.unon.org/resolution/uploads/guidelines_for_marine_plastic_litter_stocktake_survey_2_hs1.pdf" target="_blank" className="bold">這裡</a>.</p>
            </Fragment>,
            l: false,
        }, {
            q: "為什麼會有交互式儀表板和在線存儲平台？",
            a: <p className="text-justify">啟用訪問 <a className="bold" href="https://wedocs.unep.org/bitstream/handle/20.500.11822/28471/English.pdf" target="_blank">減少海洋塑料和微塑料流入海洋的全球行動的盤點</a> 為了供公眾使用，已經開發了兩種產品。 儀錶盤旨在直觀地匯總調查結果，而存儲庫的主要目標是存儲有關每個單獨操作的其他信息.</p>,
            l: [
                <p className="text-justify">您當前正在訪問交互式儀表板。 儀表板包含通過在線調查報告的所有操作。 儀表板的目的是直觀地表示有關許多關鍵屬性的調查數據。 儀表板還允許在國家/地區級別進行比較並下載視覺效果.</p>,
                <p className="text-justify">可以訪問在線存儲庫平台 <a className="bold" href="https://unep.akvoapp.org/project-directory/unep" target="_blank">這裡</a>. 資料庫包含通過在線調查和敘述提交的所有報告的行動。 可以應用許多自定義過濾器來搜索單個操作。 用戶可以在其上訪問各個操作的頁面以閱讀摘要並訪問有關每個操作的其他信息，例如PDF格式的報告或相應的網站.</p>
            ]
        }, {
            q: "誰是儀表板和存儲庫？",
            a: <p className="text-justify">儀表板和存儲庫都是公開可用的。 任何對減少海洋塑料和微塑料流入海洋的全球行動感興趣的人。 用戶可以是決策者，研究人員，學生.</p>,
            l: false,
        }, {
            q: "儀表板和存儲庫何時建立？",
            a: <p className="text-justify">建立儀表板和存儲庫的項目於2019年底開始，兩種產品已於2020年9月以英文在線發布。 目前正在建設所有六種聯合國語言的實施.</p>,
            l: false,
        }
    ],
};

export const glossary = {
    ar: [
        {
            c: "إجراءات متعددة البلدان",
            m: "تنفيذ الإجراءات المشتركة في بلدان متعددة"
        },{
            c: "الإجراءات القطرية",
            m: "الإجراءات التي يتم تنفيذها فقط في بلد معين"
        },{
            c: "حافظ على عامل التصفية",
            m: "يضمن أن المرشح الحالي قابل للتطبيق على جميع علامات التبويب"
        },{
            c: "منطقة",
            m: "قائمة البحار الإقليمية. الدول الجزرية الصغيرة النامية (SIDS) والبلدان الأقل نموًا (LDC)"
        }
    ],

    en: [
        {
            c: "Multi country actions",
            m: "Actions implementation shared over multiple countries"
        },{
            c: "Country actions",
            m: "Actions implemented only in a particular country"
        },{
            c: "Keep Filter",
            m: "Ensures that current filter is applicable to all the tabs"
        },{
            c: "Region",
            m: "List of Regional seas. Small Island Developing States (SIDS) and Least Developed Countries (LDC)"
        }
    ],

    es: [
        {
            c: "Acciones multinacionales",
            m: "Implementación de acciones compartida en múltiples países"
        },{
            c: "Acciones de país",
            m: "Acciones llevadas a cabo sólo en un país en particular"
        },{
            c: "Mantener filtro",
            m: "Asegura que el filtro actual sea aplicable a todas las pestañas"
        },{
            c: "Región",
            m: "Lista de mares regionales. Pequeños Estados insulares en desarrollo (PEID) y países menos adelantados (PMA)"
        }
    ],

    fr: [
        {
            c: "Actions multi-pays",
            m: "Mise en œuvre des actions partagée sur plusieurs pays"
        },{
            c: "Actions nationales",
            m: "ActiActions mises en œuvre uniquement dans un pays particulier"
        },{
            c: "Garder le filtre",
            m: "S'assure que le filtre actuel est applicable à tous les onglets"
        },{
            c: "Région",
            m: "Liste des mers régionales. Petits États insulaires en développement (PEID) et pays les moins avancés (PMA)"
        }
    ],

    ru: [
        {
            c: "Действия в нескольких странах",
            m: "Реализация действий распространяется на несколько стран"
        },{
            c: "Действия страны",
            m: "Действия реализованы только в определенной стране"
        },{
            c: "Сохранить фильтр",
            m: "Гарантирует, что текущий фильтр применим ко всем вкладкам"
        },{
            c: "Область",
            m: "Список региональных морей. Малые островные развивающиеся государства (МОРАГ) и наименее развитые страны (НРС)"
        }
    ],

    zh: [
        {
            c: "多國行動",
            m: "行動執行在多個國家共享"
        },{
            c: "國家行動",
            m: "僅在特定國家/地區實施的行動"
        },{
            c: "保持篩選",
            m: "確保當前過濾器適用於所有選項卡"
        },{
            c: "地區",
            m: "區域海洋列表。 小島嶼發展中國家（SIDS）和最不發達國家（LDC）"
        }
    ],
};
