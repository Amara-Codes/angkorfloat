PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "image" BLOB,
    "imageUrl" TEXT,
    "surname" TEXT,
    "biography" TEXT
);
INSERT INTO "User" ("id","name","email","password","createdAt","updatedAt","image","imageUrl","surname","biography") VALUES('cmp5enc5w000h5m78xojkufia','Roberto','amarabeerlab@gmail.com','$2b$10$T/n1IbBf4V53n4NL/bHoG./BTSk16HHhnukPIjXf0A43JaHwX.sF2',1778758102868,'2026-05-22T01:27:56.223+00:00',NULL,'https://assets.angkorfloat.com/users/images/user-cmp5enc5w000h5m78xojkufia-1779413275164.jpg','Barbagallo','Wellness explorer, holistic practitioner, and First-Degree Reiki channel. Deeply passionate about ancient wisdom and the expansion of mind, his work focuses on bridging individual inner healing with spirituality and collective consciousness.');
INSERT INTO "User" ("id","name","email","password","createdAt","updatedAt","image","imageUrl","surname","biography") VALUES('cmp7r4sxe00025m44g1auj8iv','Content ','content@creator.com','$2b$10$.gnIUqeO7AajrPiwFJC8VOKc./rAfmqamWObR9BAKcnZY//NjsPxK',1778900005491,'2026-05-22T01:30:05.302+00:00',NULL,'https://assets.angkorfloat.com/users/images/user-cmp7r4sxe00025m44g1auj8iv-1779413404940.avif','Creator','Passionate about holistic well-being, ancient wisdom, and modern spirituality. Through my content, I explore the healing power of yoga, sound therapy, and shamanic practices to help you reconnect with your inner rhythm and find balance in a fast-paced world.');
INSERT INTO "User" ("id","name","email","password","createdAt","updatedAt","image","imageUrl","surname","biography") VALUES('cmpaj8agw000s5mh0myri77rh','Super Admin','admin@angkorfloat.com','$2b$10$t3A9mlQFLsIuAa8t71abKO9viyTkxlFFnt5p6qXrLVN7UQ0wsHvO.',1779068129792,'2026-05-22T10:57:53.300+00:00',NULL,'https://assets.angkorfloat.com/users/images/user-cmpaj8agw000s5mh0myri77rh-1779413324689.png','','');
INSERT INTO "User" ("id","name","email","password","createdAt","updatedAt","image","imageUrl","surname","biography") VALUES('cmpjauv660000qp0pv5bv2cza','Joel','joelaltman@hotmail.com','$2b$10$lxSSVtZn5UoO.L8sZVAnGerouc7CULdOeQtEbj2roq/IN/rucX.fm','2026-05-24T04:51:02.093+00:00','2026-05-24T04:51:02.093+00:00',NULL,'https://assets.angkorfloat.com/users/images/user-new-1779598261603.jpg','Altman','Founder and Director of Hariharalaya');
CREATE TABLE IF NOT EXISTS "Role" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "Role" ("id","name","createdAt","updatedAt") VALUES('cmp5enc3h000g5m78ejl55yfn','ADMIN',1778758102781,1779249907634);
INSERT INTO "Role" ("id","name","createdAt","updatedAt") VALUES('cmp7msrvc000p5mospf9trjs1','SUPERADMIN',1778892725784,1778892725784);
INSERT INTO "Role" ("id","name","createdAt","updatedAt") VALUES('cmp7msrvh000q5mos0ogn1hjf','CONTENT_CREATOR',1778892725790,1778899140569);
INSERT INTO "Role" ("id","name","createdAt","updatedAt") VALUES('cmp7msrvm000r5mosths40adt','STORE_MANAGER',1778892725795,1779249850050);
CREATE TABLE IF NOT EXISTS "Permission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES('cmp5enc0c00005m789wky3sf7','blog:create',1778758102669,1778758102669);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES('cmp5enc0p00025m78jz2f524e','blog:delete',1778758102682,1778758102682);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES('cmp5enc0x00035m78vkvwtyn0','blog:publish',1778758102689,1778758102689);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES('cmp5enc1200045m78ejlkxa6y','therapist:create',1778758102695,1778758102695);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES('cmp5enc1p00065m78532un5uw','therapist:delete',1778758102717,1778758102717);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES('cmp5enc2e000a5m78zrlq2mnj','session:create',1778758102742,1778758102742);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES('cmp5enc2u000c5m782p7q1f14','session:delete',1778758102758,1778758102758);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES('cmp7msrte00015mosg28ohzkl','blog:read',1778892725714,1778892725714);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES('cmp7msrth00025mosxlrageid','blog:update',1778892725718,1778892725718);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES('cmp7msrtn00055mosymzd6uws','therapist:read',1778892725724,1778892725724);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES('cmp7msrtr00065moso69ap2ct','therapist:update',1778892725728,1778892725728);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES('cmp7msrty00095mosxdpdz8o8','session:read',1778892725735,1778892725735);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES('cmp7msru2000a5mosovig2q19','session:update',1778892725739,1778892725739);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES('cmp7msru6000c5mosunla4ucp','package:create',1778892725743,1778892725743);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES('cmp7msrua000d5mosd6nx32yr','package:read',1778892725746,1778892725746);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES('cmp7msrud000e5mos8q8p290l','package:update',1778892725749,1778892725749);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES('cmp7msruh000f5mosgxmsflgv','package:delete',1778892725753,1778892725753);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES('cmp7msrul000g5mosd5hfbqpb','user:create',1778892725758,1778892725758);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES('cmp7msruo000h5mosz7o980tn','user:read',1778892725760,1778892725760);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES('cmp7msrur000i5mosnkiaihrs','user:update',1778892725763,1778892725763);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES('cmp7msruu000j5mosuv294rwr','user:delete',1778892725766,1778892725766);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES('cmp7msruw000k5mosfuqtirpk','role:create',1778892725769,1778892725769);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES('cmp7msrv1000l5moss5nyq1wd','role:read',1778892725773,1778892725773);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES('cmp7msrv4000m5moszsj43nad','role:update',1778892725776,1778892725776);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES('cmp7msrv7000n5mos9mn9aiy7','role:delete',1778892725779,1778892725779);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES('cmpdg4itw000o5mm4ong4mv7x','faq:create',1779244313685,1779244313685);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES('cmpdg4iu5000p5mm4pnyz9n8l','faq:read',1779244313694,1779244313694);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES('cmpdg4iub000q5mm43v8nzzg0','faq:update',1779244313700,1779244313700);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES('cmpdg4iui000r5mm4hwtakx61','faq:delete',1779244313707,1779244313707);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES('cmpdg4iuq000t5mm4e8alauve','faq:publish',1779244313714,1779244313714);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES('cmpdirdyn000s5mbk4ehsctep','category:create',1779248739695,1779248739695);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES('cmpdirdys000t5mbk90baqycr','category:read',1779248739701,1779248739701);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES('cmpdirdyv000u5mbkn8vikg1h','category:update',1779248739704,1779248739704);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES('cmpdirdyz000v5mbk51zrcufa','category:delete',1779248739707,1779248739707);
CREATE TABLE IF NOT EXISTS "BlogPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "thumbnailImage" BLOB,
    "thumbnailUrl" TEXT,
    "thumbnailCaption" TEXT,
    "content" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "ogImage" BLOB,
    "ogImageUrl" TEXT,
    "canonicalUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "showAuthor" BOOLEAN NOT NULL DEFAULT true,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "caption" TEXT,
    "keywords" TEXT,
    "ogDescription" TEXT,
    "ogTitle" TEXT,
    "ogType" TEXT DEFAULT 'article',
    "robots" TEXT,
    "pageTheme" TEXT DEFAULT 'blue-coconut',
    CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "BlogPost" ("id","title","slug","thumbnailImage","thumbnailUrl","thumbnailCaption","content","metaTitle","metaDescription","ogImage","ogImageUrl","canonicalUrl","published","showAuthor","authorId","createdAt","updatedAt","caption","keywords","ogDescription","ogTitle","ogType","robots","pageTheme") VALUES('cmp5kjqhs00035m0k50a9cf4r','The power of Silence','the-power-of-silence',NULL,'https://assets.angkorfloat.com/blog-posts/thumbnails/post-thumb-cmp5kjqhs00035m0k50a9cf4r-1779418704441.jpg','A modern, white floatation tank with an open lid inside a cozy, dimly lit wellness room. Green potted plants are in the foreground, and the room features dark tiled floors and textured bamboo walls under a calming blue light.','[{"id":"h16b63wpm","type":"simpleHero","props":{"title":"The Power of Silence: Rediscovering Inner Stillness","subtitle":"Step into a world where noise fades, clarity returns, and your soul truly speaks. Discover the profound impact of intentional silence in a modern, buzzing world.","imageSrc":"https://assets.angkorfloat.com/blog-posts/images/post-module-simpleHero-cmp5kjqhs00035m0k50a9cf4r-1779419569577.jpg","imageAlt":"Hero image","align":"center","vAlign":"center","overlayOpacity":0.36,"lightOverlayColor":"rosewood","darkOverlayColor":"green","parallax":true,"titleColorClassName":"text-custom-coconut/100 dark:text-custom-celadon/100","subtitleColorClassName":"text-custom-coconut/100 dark:text-custom-celadon/100","overlayClasses":"bg-custom-celadon dark:bg-custom-blue"}},{"id":"dcs7wfs5w","type":"paragraph","props":{"children":"We live in a world that treats noise as a constant companion, where our minds are continuously bombarded by notifications, chatter, and the relentless hum of modern life. Yet, the deepest healing doesn’t happen in the chaos; it awaits in the spaces between the noise. Silence is not merely the absence of sound—it is a potent, active medicine for the nervous system. When we intentionally step away from the external buzz and enter a state of true quiet, our brain enters a state of \"acoustic rest.\" In this sacred stillness, the mind finally stops reacting to the outside world and begins to listen inward, unlocking a profound capacity for emotional clarity, cellular renewal, and spiritual reconnection.","as":"p","size":"2xl","weight":"normal","variant":"default","align":"left","scrollReveal":false,"colorClassName":"text-custom-blue/100 dark:text-custom-celadon/100","fontFamily":"standard","bgColor":"transparent"}},{"id":"1zi8cao9k","type":"paragraph","props":{"children":"True silence is where the clutter ends and clarity begins. By actively shutting out the external noise—whether through meditation or the weightless isolation of a float tank—we give our overstimulated minds permission to just be. In that space of pure stillness, the background static fades, allowing your inner voice, intuition, and deepest truths to finally be heard.","as":"p","size":"3xl","weight":"normal","variant":"default","align":"center","scrollReveal":true,"colorClassName":"text-custom-blue/100 dark:text-custom-celadon/100","fontFamily":"standard","bgColor":"coconut-green"}},{"id":"kdwhzn64s","type":"quote","props":{"children":"In the attitude of silence the soul finds the path in a clearer light, and what is elusive and deceptive resolves itself into crystal clarity.","author":"Mahatma Gandhi","authorDates":"1869–1948","authorInfo":"Indian lawyer and anti-colonial nationalist who employed nonviolent resistance to lead the successful campaign for India''s independence from British rule, inspiring movements for civil rights and freedom across the world","colorClassName":"text-custom-almond/100 dark:text-custom-celadon/100","bgColorClassName":"bg-custom-blue/100 dark:bg-custom-blue/100","fontFamily":"standard","bgColor":"blue-celadon","colors":"green-coconut"}},{"id":"3o29bjeyj","type":"paragraphWithImage","props":{"children":"A float tank is the physical manifestation of true silence. By eliminating 90% of sensory input, sensory deprivation isolates you from the external friction of the world—no light, no sound, and no gravity. In this profound stillness, your nervous system finally drops its guard, shifting from a state of constant reaction to deep, restorative healing. It is here, suspended in weightless quiet, that the brain slows down, the internal chatter fades, and you can truly experience the transformative power of absolute silence.","as":"p","size":"4xl","weight":"normal","variant":"default","align":"left","imageSrc":"https://assets.angkorfloat.com/blog-posts/images/post-module-paragraphWithImage-cmp5kjqhs00035m0k50a9cf4r-1779419570101.jpg","imageAlt":"shell","imagePosition":"left","imageAspectRatio":"video","parallax":false,"parallaxSpeed":0.3,"overlayOpacity":0.4,"colorClassName":"text-custom-blue/100 dark:text-custom-celadon/100","fontFamily":"josefin"}},{"id":"9g9rwcp1g","type":"spacer","props":{"height":"md","type":"divider","lineColor":"blue","lineWidth":"100%","opacity":0.9,"lineHeight":"1"}},{"id":"pgpxos84z","type":"actioncta","props":{"title":"Ready to Experience True Silence?","paragraph":"Disconnect from the noise of the outside world and reconnect with your inner stillness. Book your first float session today and discover the profound power of deep, weightless rest.","imageSrc":"https://assets.angkorfloat.com/blog-posts/images/post-module-actioncta-cmp5kjqhs00035m0k50a9cf4r-1779419498191.jpg","imageAlt":"sink","imagePosition":"right","buttonOneLabel":"Book Now","buttonOneLink":"/book-now","buttonOneVariant":"secondary","buttonTwoLabel":"","buttonTwoLink":"","buttonTwoVariant":"secondary","fontFamily":"kugile","titleColorClassName":"text-custom-rosewood/100 dark:text-custom-celadon/100","paragraphColorClassName":"text-custom-blue/100 dark:text-custom-celadon/100"}}]','','',NULL,'https://assets.angkorfloat.com/blog-posts/og-images/post-og-cmp5kjqhs00035m0k50a9cf4r-1779419738696.jpg','',1,1,'cmp5enc5w000h5m78xojkufia',1778768012510,'2026-05-22T03:46:33.545+00:00','We live in a world that never stops talking, buzzing, or notifying. But the deepest healing often happens when the noise stops.','','','','article','index, follow','rosewood-almond');
INSERT INTO "BlogPost" ("id","title","slug","thumbnailImage","thumbnailUrl","thumbnailCaption","content","metaTitle","metaDescription","ogImage","ogImageUrl","canonicalUrl","published","showAuthor","authorId","createdAt","updatedAt","caption","keywords","ogDescription","ogTitle","ogType","robots","pageTheme") VALUES('cmpjbjxa70002qp0pxze79el8','Living in the Present Moment','present-moment',NULL,'https://assets.angkorfloat.com/blog-posts/thumbnails/post-thumb-new-1779599426613.jpg','','[{"id":"cx8jt48ao","type":"simpleHero","props":{"title":"Where is the Present Moment?","subtitle":"A compass to find your way home","imageSrc":"https://assets.angkorfloat.com/blog-posts/images/post-module-simpleHero-new-1779599427820.jpg","imageAlt":"Hero image","align":"center","vAlign":"center","overlayOpacity":0.4,"lightOverlayColor":"black","darkOverlayColor":"black","parallax":true,"titleColorClassName":"text-custom-coconut/100 dark:text-custom-celadon/100","subtitleColorClassName":"text-custom-coconut/80 dark:text-custom-celadon/80"}},{"id":"ag62mz4v2","type":"quote","props":{"children":"In order to find yourself in the present moment, first you have to lose the idea of yourself. Only when you forget yourself can you truly be who you are","author":"Lokta Joel","authorDates":"","authorInfo":"","colorClassName":"text-custom-blue/100 dark:text-custom-celadon/100","bgColorClassName":"bg-custom-celadon/80 dark:bg-custom-rosewood/80","fontFamily":"standard"}},{"id":"8tguovyn9","type":"horizontalSlider","props":{"title":"Present Moment","subtitle":"Myths About The","scrollDistance":"300vh","items":[{"title":"I can see the present moment. ","description":"The present moment is everything everywhere at once. From the micro to the macrocosm. What you see with your eyes is a small distorted fraction of that. ","id":"becwjlnzd"},{"title":"My present moment","description":"The present moment belongs to no one. You can lose yourself in the present moment, like a river loses itself into the ocean. ","id":"jcsxgcpn9"},{"title":"One moment to the next","description":"There is no next moment. The present moment encompasses everything everywhere. There is no next or other. ","id":"zsvfnd8ei"}]}},{"id":"mr5jc9are","type":"paragraphWithImage","props":{"children":"There are many ways to tune yourself. Breathwork, Meditation, Sound Healing, Acupuncture, Nature are a few simple ways to cultivate inner beauty and harmony. ","as":"p","size":"lg","weight":"medium","variant":"default","align":"left","imageSrc":"https://assets.angkorfloat.com/blog-posts/images/post-module-paragraphWithImage-new-1779599428122.jpg","imageAlt":"","imagePosition":"top","imageAspectRatio":"video","parallax":true,"parallaxSpeed":0.3,"overlayOpacity":0.5,"colorClassName":"text-custom-blue/100 dark:text-custom-celadon/100","fontFamily":"josefin"}},{"id":"4f0gqahwb","type":"actioncta","props":{"title":"","paragraph":"Find out more about what we have to offer!","imageSrc":"","imageAlt":"","imagePosition":"right","buttonOneLabel":"Read Other Articles","buttonOneLink":"/blog","buttonOneVariant":"outline","buttonTwoLabel":"Contact Us","buttonTwoLink":"/contacts","buttonTwoVariant":"secondary","fontFamily":"standard","titleColorClassName":"text-custom-rosewood/100 dark:text-custom-celadon/100","paragraphColorClassName":"text-custom-blue/100 dark:text-custom-celadon/100"}}]','Living in the Present Moment','',NULL,NULL,'',1,1,'cmpjauv660000qp0pv5bv2cza','2026-05-24T05:10:31.232+00:00','2026-05-24T05:23:26.369+00:00','The mind is always caught in the past and future. In order to live in the present moment, we must balance the breath and enter into a state of no mind. ','','','','article','index, follow','blue-coconut');
CREATE TABLE IF NOT EXISTS "Media" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bytes" BLOB,
    "url" TEXT,
    "key" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Media_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BlogPost" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "Media" ("id","bytes","url","key","postId","createdAt") VALUES('cmp6za5gc00015mz4ud244wt9',NULL,NULL,'module_yd5226i6y_image','cmp5kjqhs00035m0k50a9cf4r',1778853225753);
INSERT INTO "Media" ("id","bytes","url","key","postId","createdAt") VALUES('cmpayhajh00015m9sb74c42yg',NULL,NULL,'module_um9mhrg8h_image','cmp5kjqhs00035m0k50a9cf4r',1779093744025);
CREATE TABLE IF NOT EXISTS "Therapist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "specialties" TEXT NOT NULL,
    "specialties_kh" TEXT,
    "image" BLOB,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "Therapist" ("id","name","bio","specialties","specialties_kh","image","imageUrl","isActive","createdAt","updatedAt") VALUES('cmpauapyw00005mu8tnlzu38f','Lokta Joel ','','Yoga, Meditation, Sound healing','យូហ្គា សមាធិ និង ការព្យាបាលដោយសំឡេង',NULL,'https://assets.angkorfloat.com/therapists/images/therapist-cmpauapyw00005mu8tnlzu38f-1779413095303.webp',1,1779086718968,'2026-05-22T01:24:56.406+00:00');
INSERT INTO "Therapist" ("id","name","bio","specialties","specialties_kh","image","imageUrl","isActive","createdAt","updatedAt") VALUES('cmpauc2ci00015mu8n9378hv6','Paige Klumb','','Breathwork, Yoga, Sound Healing',NULL,NULL,'https://assets.angkorfloat.com/therapists/images/therapist-cmpauc2ci00015mu8n9378hv6-1779413125826.webp',1,1779086781666,'2026-05-22T01:25:26.180+00:00');
INSERT INTO "Therapist" ("id","name","bio","specialties","specialties_kh","image","imageUrl","isActive","createdAt","updatedAt") VALUES('cmpaucn5a00025mu8jh7myfhp','Mona Simon ','','Energy Healing',NULL,NULL,'https://assets.angkorfloat.com/therapists/images/therapist-cmpaucn5a00025mu8jh7myfhp-1779413162171.webp',1,1779086808622,'2026-05-22T01:26:02.511+00:00');
INSERT INTO "Therapist" ("id","name","bio","specialties","specialties_kh","image","imageUrl","isActive","createdAt","updatedAt") VALUES('cmpaud6a500035mu8aj9uru6t','Pascal','','Acupuncture',NULL,NULL,'https://assets.angkorfloat.com/therapists/images/therapist-cmpaud6a500035mu8aj9uru6t-1779413145724.webp',1,1779086833422,'2026-05-22T01:25:46.027+00:00');
INSERT INTO "Therapist" ("id","name","bio","specialties","specialties_kh","image","imageUrl","isActive","createdAt","updatedAt") VALUES('cmpauduf400045mu855865l9c','Darren Swallow','','Shamanic Healing',NULL,NULL,'https://assets.angkorfloat.com/therapists/images/therapist-cmpauduf400045mu855865l9c-1779413176967.webp',1,1779086864704,'2026-05-22T01:26:17.337+00:00');
INSERT INTO "Therapist" ("id","name","bio","specialties","specialties_kh","image","imageUrl","isActive","createdAt","updatedAt") VALUES('cmpauf1py00055mu8pnzug9ki','Tingting Pan','','Yoga, Sound Healing',NULL,NULL,'https://assets.angkorfloat.com/therapists/images/therapist-cmpauf1py00055mu8pnzug9ki-1779413203640.webp',1,1779086920822,'2026-05-22T01:26:43.960+00:00');
INSERT INTO "Therapist" ("id","name","bio","specialties","specialties_kh","image","imageUrl","isActive","createdAt","updatedAt") VALUES('cmpauftvq00065mu84g4567qf','Jennafer XX','','Therapeutic Massage',NULL,NULL,'https://assets.angkorfloat.com/therapists/images/therapist-cmpauftvq00065mu84g4567qf-1779413113869.webp',0,1779086957318,'2026-05-24T05:27:32.686+00:00');
INSERT INTO "Therapist" ("id","name","bio","specialties","specialties_kh","image","imageUrl","isActive","createdAt","updatedAt") VALUES('cmpaugfgq00075mu85l43foc9','Rachel Bilski','','Yoga Therapy',NULL,NULL,'https://assets.angkorfloat.com/therapists/images/therapist-cmpaugfgq00075mu85l43foc9-1779413192183.webp',1,1779086985290,'2026-05-22T01:26:32.540+00:00');
INSERT INTO "Therapist" ("id","name","bio","specialties","specialties_kh","image","imageUrl","isActive","createdAt","updatedAt") VALUES('cmpjc375u0004qp0ptpgrzozs','Ram Charan','Ram Charan has been practicing healing arts for more than 30 years. He spent several years in India close with spiritual masters, including Papaji, Ram Dass, Siddhi Ma and many others. ','Craniosacral, Life Coach, Therapeutic Massage',NULL,NULL,'https://assets.angkorfloat.com/therapists/images/therapist-new-1779600330197.jpg',0,'2026-05-24T05:25:30.498+00:00','2026-05-24T05:27:42.631+00:00');
CREATE TABLE IF NOT EXISTS "HealingSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "therapistId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HealingSession_therapistId_fkey" FOREIGN KEY ("therapistId") REFERENCES "Therapist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "FloatPackage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "sessionCount" INTEGER NOT NULL,
    "validityDays" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
CREATE TABLE IF NOT EXISTS "Faq" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "question" TEXT NOT NULL,
    "question_kh" TEXT,
    "answer" TEXT NOT NULL,
    "answer_kh" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "Faq" ("id","question","question_kh","answer","answer_kh","published","createdAt","updatedAt") VALUES('cmpgaj18x00005mg0ivolgf5j','Do I need to bring anything?',NULL,'Just yourself. Towels, shower products, earplugs, and everything you need are provided. A hair tie is useful if you have long hair.',NULL,1,'2026-05-22T02:18:31.568+00:00','2026-05-22T02:18:31.568+00:00');
INSERT INTO "Faq" ("id","question","question_kh","answer","answer_kh","published","createdAt","updatedAt") VALUES('cmpgajhz400015mg050v707n8','How early should I arrive?',NULL,'10–15 minutes before your session, especially the first time. Arriving rushed is the one thing that makes floating harder than it needs to be.',NULL,1,'2026-05-22T02:18:53.248+00:00','2026-05-22T02:18:53.248+00:00');
INSERT INTO "Faq" ("id","question","question_kh","answer","answer_kh","published","createdAt","updatedAt") VALUES('cmpgajxr800025mg0paakjm3r','What should I eat and drink?',NULL,'A light meal 2–3 hours before. Avoid caffeine and alcohol for a few hours prior — both become amplified in a highly sensitive environment.',NULL,1,'2026-05-22T02:19:13.700+00:00','2026-05-22T02:19:13.700+00:00');
INSERT INTO "Faq" ("id","question","question_kh","answer","answer_kh","published","createdAt","updatedAt") VALUES('cmpgakjyz00035mg0yuw063tg','What should I wear?',NULL,'The tanks are set up for people to float without clothing — anything you wear becomes heavy with salt and tends to be distracting. You''ll have complete privacy. ',NULL,1,'2026-05-22T02:19:42.491+00:00','2026-05-22T02:20:16.870+00:00');
INSERT INTO "Faq" ("id","question","question_kh","answer","answer_kh","published","createdAt","updatedAt") VALUES('cmpgal0ol00045mg0lnue834c','Do I need to know how to meditate?',NULL,'No. The float environment does most of the work. Your nervous system slows down automatically. Your breath becomes deeper and more balanced. Many people who struggle with sitting meditation find floating far more accessible — there''s nothing to maintain, nowhere to be uncomfortable.',NULL,1,'2026-05-22T02:20:04.149+00:00','2026-05-22T02:20:11.999+00:00');
INSERT INTO "Faq" ("id","question","question_kh","answer","answer_kh","published","createdAt","updatedAt") VALUES('cmpgalmwa00055mg0u0rg6zq9','How will I feel after?',NULL,'You will feel deeply calm, physically relaxed and mentally recharged. Some people feel energised, others feel deeply still. Both are good. Give yourself time to settle in — don''t rush back to screens or activity.',NULL,1,'2026-05-22T02:20:32.939+00:00','2026-05-22T02:20:32.939+00:00');
INSERT INTO "Faq" ("id","question","question_kh","answer","answer_kh","published","createdAt","updatedAt") VALUES('cmpgam1ue00065mg0so605rxy','What is the integration hour?',NULL,replace(replace('Most float centres end when you step out of the tank. Our signature float packages include an hour of creativity, journaling, nature and space to just breathe. We want you to have time to properly digest and anchor the deeper state of peace and silence. \r\nMost people find this time as valuable as the float itself.','\r',char(13)),'\n',char(10)),NULL,1,'2026-05-22T02:20:52.310+00:00','2026-05-22T02:20:57.002+00:00');
INSERT INTO "Faq" ("id","question","question_kh","answer","answer_kh","published","createdAt","updatedAt") VALUES('cmpgami5l00075mg05k4h7qgm','How many sessions before I feel a difference?',NULL,'Many people notice significant benefits after a single session. Most people find the second and third floats noticeably deeper. Three sessions in a row has been proven the most beneficial for overall health and wellbeing. ',NULL,1,'2026-05-22T02:21:13.450+00:00','2026-05-22T02:21:17.059+00:00');
INSERT INTO "Faq" ("id","question","question_kh","answer","answer_kh","published","createdAt","updatedAt") VALUES('cmpgan1lc00085mg07sj592ub','Can I combine a float with other treatments?',NULL,'Yes — and stacking treatments amplifies results. The massage before the float deepens physical release. Breathwork, bodywork or energy healing after the float help to bring it all together. ',NULL,1,'2026-05-22T02:21:38.640+00:00','2026-05-22T02:21:38.640+00:00');
INSERT INTO "Faq" ("id","question","question_kh","answer","answer_kh","published","createdAt","updatedAt") VALUES('cmpganfgf00095mg0kx31s2la','What if I feel claustrophobic?',NULL,'The tanks are much larger than most people expect — you can sit up, stretch your arms, move freely. The door is never locked. Many people who experience claustrophobia find it simply doesn''t arise once they''re in. If you''re concerned, let us know when you book.',NULL,1,'2026-05-22T02:21:56.607+00:00','2026-05-22T02:21:56.607+00:00');
INSERT INTO "Faq" ("id","question","question_kh","answer","answer_kh","published","createdAt","updatedAt") VALUES('cmpganxt2000a5mg0mc3mbb0d','Can I drown? What if I fall asleep?',NULL,'No. The salt concentration is higher than the Dead Sea — sinking is impossible. The water is only 25cm deep. Falling asleep in the tank is completely safe and often a sign your nervous system needs it.',NULL,1,'2026-05-22T02:22:20.391+00:00','2026-05-22T02:22:29.936+00:00');
INSERT INTO "Faq" ("id","question","question_kh","answer","answer_kh","published","createdAt","updatedAt") VALUES('cmpgaofww000b5mg05pv9i7cv','Will my skin wrinkle or dry out?',NULL,'No. The Epsom salt concentration in the tank is higher than in your body, so it works the opposite way. Most people step out feeling noticeably smoother. Epsom salt has been used for centuries to treat skin conditions.',NULL,1,'2026-05-22T02:22:43.857+00:00','2026-05-22T02:22:43.857+00:00');
INSERT INTO "Faq" ("id","question","question_kh","answer","answer_kh","published","createdAt","updatedAt") VALUES('cmpgap0o5000c5mg0n9f6p0qx','How is the water kept clean?',NULL,'The high salt concentration creates a naturally sterile environment — microorganisms cannot survive in it. Between every session the water passes through full filtration and UV sanitation. All guests shower before entering. The water is cleaner than a standard swimming pool.',NULL,1,'2026-05-22T02:23:10.757+00:00','2026-05-22T02:23:10.757+00:00');
INSERT INTO "Faq" ("id","question","question_kh","answer","answer_kh","published","createdAt","updatedAt") VALUES('cmpgapltm000d5mg0nk8alatp','What if I get salt in my eyes?',NULL,replace(replace('It stings — no way around it. There''s a facecloth and spray bottle of fresh water inside the tank. Dab, rinse, and it passes quickly. The main cause is touching your face with wet hands.\r\n','\r',char(13)),'\n',char(10)),NULL,1,'2026-05-22T02:23:38.170+00:00','2026-05-22T02:23:38.170+00:00');
INSERT INTO "Faq" ("id","question","question_kh","answer","answer_kh","published","createdAt","updatedAt") VALUES('cmpgapyx1000e5mg0m5g46n3c','Is there support for my neck?',NULL,'Yes — a neck pillow is available on request. Ask before your session and we''ll have it ready in the tank.',NULL,1,'2026-05-22T02:23:55.141+00:00','2026-05-22T02:23:55.141+00:00');
INSERT INTO "Faq" ("id","question","question_kh","answer","answer_kh","published","createdAt","updatedAt") VALUES('cmpgaqd6e000f5mg083zfpqp9','Is floating safe?',NULL,'Yes. Float therapy is safe and has been used therapeutically for over 70 years. There are specific contraindications — covered in our health declaration when you book. If you''re unsure, contact us before booking.',NULL,1,'2026-05-22T02:24:13.622+00:00','2026-05-22T02:24:13.622+00:00');
INSERT INTO "Faq" ("id","question","question_kh","answer","answer_kh","published","createdAt","updatedAt") VALUES('cmpgaqqe5000g5mg0c4eoo0c2','Can I float if I''m pregnant?',NULL,'Many pregnant women find floating deeply relaxing— the weightlessness removes real gravitational strain. We recommend consulting your doctor before you float as well as waiting until you are in your second trimester.',NULL,1,'2026-05-22T02:24:30.750+00:00','2026-05-22T02:24:30.750+00:00');
INSERT INTO "Faq" ("id","question","question_kh","answer","answer_kh","published","createdAt","updatedAt") VALUES('cmpgar6bo000h5mg0o59aid1l','Can I float during my period?',NULL,replace(replace('We do not recommend floating when you are on your period. \r\n','\r',char(13)),'\n',char(10)),NULL,1,'2026-05-22T02:24:51.396+00:00','2026-05-22T02:24:51.396+00:00');
INSERT INTO "Faq" ("id","question","question_kh","answer","answer_kh","published","createdAt","updatedAt") VALUES('cmpgarjlq000i5mg0s75g4e4g','Is there an age limit?',NULL,replace(replace('Guests under 16 are welcome with a parent or guardian present to sign the waiver and remain on-site. Contact us in advance to arrange.\r\n','\r',char(13)),'\n',char(10)),NULL,1,'2026-05-22T02:25:08.606+00:00','2026-05-22T02:25:08.606+00:00');
INSERT INTO "Faq" ("id","question","question_kh","answer","answer_kh","published","createdAt","updatedAt") VALUES('cmpgarxmc000j5mg0zzbgwnld','Is this evidence-based or alternative wellness?',NULL,'Float therapy — clinically known as Flotation-REST — has been studied since the 1950s and has a serious, growing research base. Published studies have demonstrated measurable effects on anxiety, depression, PTSD, chronic pain, blood pressure, cortisol, and athletic recovery. See our Science page for key studies and links.',NULL,1,'2026-05-22T02:25:26.772+00:00','2026-05-22T08:31:03.915+00:00');
CREATE TABLE IF NOT EXISTS "PostCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "PostCategory" ("id","name","createdAt","updatedAt") VALUES('cmpdixu2m00005m6oqvq5s90e','Mindfulness',1779249040511,'2026-05-22T02:11:31.597+00:00');
INSERT INTO "PostCategory" ("id","name","createdAt","updatedAt") VALUES('cmpdiy83s00015m6ofz7hbczr','Floatation',1779249058696,1779249058696);
INSERT INTO "PostCategory" ("id","name","createdAt","updatedAt") VALUES('cmpdiyghs00025m6o1ip6u7h1','Silence',1779249069569,1779249069569);
INSERT INTO "PostCategory" ("id","name","createdAt","updatedAt") VALUES('cmpdkea4n00005m08cplplv1n','Wellness',1779251487431,1779251487431);
INSERT INTO "PostCategory" ("id","name","createdAt","updatedAt") VALUES('cmpjbtipv0003qp0pf10bllkk','Cambodia','2026-05-24T05:17:58.916+00:00','2026-05-24T05:17:58.916+00:00');
CREATE TABLE IF NOT EXISTS "_UserRoles" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_UserRoles_A_fkey" FOREIGN KEY ("A") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserRoles_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "_UserRoles" ("A","B") VALUES('cmp7msrvc000p5mospf9trjs1','cmp5enc5w000h5m78xojkufia');
INSERT INTO "_UserRoles" ("A","B") VALUES('cmp7msrvh000q5mos0ogn1hjf','cmp7r4sxe00025m44g1auj8iv');
INSERT INTO "_UserRoles" ("A","B") VALUES('cmp7msrvc000p5mospf9trjs1','cmpaj8agw000s5mh0myri77rh');
INSERT INTO "_UserRoles" ("A","B") VALUES('cmp7msrvc000p5mospf9trjs1','cmpjauv660000qp0pv5bv2cza');
CREATE TABLE IF NOT EXISTS "_RolePermissions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_RolePermissions_A_fkey" FOREIGN KEY ("A") REFERENCES "Permission" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_RolePermissions_B_fkey" FOREIGN KEY ("B") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp5enc0c00005m789wky3sf7','cmp7msrvc000p5mospf9trjs1');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp5enc0p00025m78jz2f524e','cmp7msrvc000p5mospf9trjs1');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp5enc0x00035m78vkvwtyn0','cmp7msrvc000p5mospf9trjs1');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp5enc1200045m78ejlkxa6y','cmp7msrvc000p5mospf9trjs1');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp5enc1p00065m78532un5uw','cmp7msrvc000p5mospf9trjs1');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp5enc2e000a5m78zrlq2mnj','cmp7msrvc000p5mospf9trjs1');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp5enc2u000c5m782p7q1f14','cmp7msrvc000p5mospf9trjs1');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msrte00015mosg28ohzkl','cmp7msrvc000p5mospf9trjs1');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msrth00025mosxlrageid','cmp7msrvc000p5mospf9trjs1');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msrtn00055mosymzd6uws','cmp7msrvc000p5mospf9trjs1');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msrtr00065moso69ap2ct','cmp7msrvc000p5mospf9trjs1');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msrty00095mosxdpdz8o8','cmp7msrvc000p5mospf9trjs1');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msru2000a5mosovig2q19','cmp7msrvc000p5mospf9trjs1');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msru6000c5mosunla4ucp','cmp7msrvc000p5mospf9trjs1');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msrua000d5mosd6nx32yr','cmp7msrvc000p5mospf9trjs1');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msrud000e5mos8q8p290l','cmp7msrvc000p5mospf9trjs1');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msruh000f5mosgxmsflgv','cmp7msrvc000p5mospf9trjs1');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msrul000g5mosd5hfbqpb','cmp7msrvc000p5mospf9trjs1');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msruo000h5mosz7o980tn','cmp7msrvc000p5mospf9trjs1');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msrur000i5mosnkiaihrs','cmp7msrvc000p5mospf9trjs1');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msruu000j5mosuv294rwr','cmp7msrvc000p5mospf9trjs1');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msruw000k5mosfuqtirpk','cmp7msrvc000p5mospf9trjs1');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msrv1000l5moss5nyq1wd','cmp7msrvc000p5mospf9trjs1');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msrv4000m5moszsj43nad','cmp7msrvc000p5mospf9trjs1');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msrv7000n5mos9mn9aiy7','cmp7msrvc000p5mospf9trjs1');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmpdg4itw000o5mm4ong4mv7x','cmp7msrvc000p5mospf9trjs1');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmpdg4iu5000p5mm4pnyz9n8l','cmp7msrvc000p5mospf9trjs1');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmpdg4iub000q5mm43v8nzzg0','cmp7msrvc000p5mospf9trjs1');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmpdg4iui000r5mm4hwtakx61','cmp7msrvc000p5mospf9trjs1');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmpdg4iuq000t5mm4e8alauve','cmp7msrvc000p5mospf9trjs1');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmpdirdyn000s5mbk4ehsctep','cmp7msrvc000p5mospf9trjs1');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmpdirdys000t5mbk90baqycr','cmp7msrvc000p5mospf9trjs1');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmpdirdyv000u5mbkn8vikg1h','cmp7msrvc000p5mospf9trjs1');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmpdirdyz000v5mbk51zrcufa','cmp7msrvc000p5mospf9trjs1');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp5enc0c00005m789wky3sf7','cmp7msrvh000q5mos0ogn1hjf');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msrte00015mosg28ohzkl','cmp7msrvh000q5mos0ogn1hjf');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msrth00025mosxlrageid','cmp7msrvh000q5mos0ogn1hjf');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmpdg4itw000o5mm4ong4mv7x','cmp7msrvh000q5mos0ogn1hjf');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmpdg4iu5000p5mm4pnyz9n8l','cmp7msrvh000q5mos0ogn1hjf');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmpdg4iub000q5mm43v8nzzg0','cmp7msrvh000q5mos0ogn1hjf');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmpdirdyn000s5mbk4ehsctep','cmp7msrvh000q5mos0ogn1hjf');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmpdirdys000t5mbk90baqycr','cmp7msrvh000q5mos0ogn1hjf');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmpdirdyv000u5mbkn8vikg1h','cmp7msrvh000q5mos0ogn1hjf');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp5enc0c00005m789wky3sf7','cmp7msrvm000r5mosths40adt');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp5enc0p00025m78jz2f524e','cmp7msrvm000r5mosths40adt');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp5enc0x00035m78vkvwtyn0','cmp7msrvm000r5mosths40adt');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msrte00015mosg28ohzkl','cmp7msrvm000r5mosths40adt');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msrth00025mosxlrageid','cmp7msrvm000r5mosths40adt');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmpdirdyn000s5mbk4ehsctep','cmp7msrvm000r5mosths40adt');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmpdirdyz000v5mbk51zrcufa','cmp7msrvm000r5mosths40adt');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmpdirdys000t5mbk90baqycr','cmp7msrvm000r5mosths40adt');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmpdirdyv000u5mbkn8vikg1h','cmp7msrvm000r5mosths40adt');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmpdg4itw000o5mm4ong4mv7x','cmp7msrvm000r5mosths40adt');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmpdg4iui000r5mm4hwtakx61','cmp7msrvm000r5mosths40adt');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmpdg4iuq000t5mm4e8alauve','cmp7msrvm000r5mosths40adt');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmpdg4iu5000p5mm4pnyz9n8l','cmp7msrvm000r5mosths40adt');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmpdg4iub000q5mm43v8nzzg0','cmp7msrvm000r5mosths40adt');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msrua000d5mosd6nx32yr','cmp7msrvm000r5mosths40adt');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msrty00095mosxdpdz8o8','cmp7msrvm000r5mosths40adt');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp5enc1200045m78ejlkxa6y','cmp7msrvm000r5mosths40adt');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp5enc1p00065m78532un5uw','cmp7msrvm000r5mosths40adt');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msrtn00055mosymzd6uws','cmp7msrvm000r5mosths40adt');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msrtr00065moso69ap2ct','cmp7msrvm000r5mosths40adt');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp5enc0c00005m789wky3sf7','cmp5enc3h000g5m78ejl55yfn');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp5enc0p00025m78jz2f524e','cmp5enc3h000g5m78ejl55yfn');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp5enc0x00035m78vkvwtyn0','cmp5enc3h000g5m78ejl55yfn');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msrte00015mosg28ohzkl','cmp5enc3h000g5m78ejl55yfn');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msrth00025mosxlrageid','cmp5enc3h000g5m78ejl55yfn');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmpdirdyn000s5mbk4ehsctep','cmp5enc3h000g5m78ejl55yfn');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmpdirdyz000v5mbk51zrcufa','cmp5enc3h000g5m78ejl55yfn');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmpdirdys000t5mbk90baqycr','cmp5enc3h000g5m78ejl55yfn');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmpdirdyv000u5mbkn8vikg1h','cmp5enc3h000g5m78ejl55yfn');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmpdg4itw000o5mm4ong4mv7x','cmp5enc3h000g5m78ejl55yfn');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmpdg4iui000r5mm4hwtakx61','cmp5enc3h000g5m78ejl55yfn');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmpdg4iuq000t5mm4e8alauve','cmp5enc3h000g5m78ejl55yfn');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmpdg4iu5000p5mm4pnyz9n8l','cmp5enc3h000g5m78ejl55yfn');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmpdg4iub000q5mm43v8nzzg0','cmp5enc3h000g5m78ejl55yfn');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msru6000c5mosunla4ucp','cmp5enc3h000g5m78ejl55yfn');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msruh000f5mosgxmsflgv','cmp5enc3h000g5m78ejl55yfn');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msrua000d5mosd6nx32yr','cmp5enc3h000g5m78ejl55yfn');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msrud000e5mos8q8p290l','cmp5enc3h000g5m78ejl55yfn');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msrv1000l5moss5nyq1wd','cmp5enc3h000g5m78ejl55yfn');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp5enc2e000a5m78zrlq2mnj','cmp5enc3h000g5m78ejl55yfn');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp5enc2u000c5m782p7q1f14','cmp5enc3h000g5m78ejl55yfn');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msrty00095mosxdpdz8o8','cmp5enc3h000g5m78ejl55yfn');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msru2000a5mosovig2q19','cmp5enc3h000g5m78ejl55yfn');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp5enc1200045m78ejlkxa6y','cmp5enc3h000g5m78ejl55yfn');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp5enc1p00065m78532un5uw','cmp5enc3h000g5m78ejl55yfn');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msrtn00055mosymzd6uws','cmp5enc3h000g5m78ejl55yfn');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msrtr00065moso69ap2ct','cmp5enc3h000g5m78ejl55yfn');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msrul000g5mosd5hfbqpb','cmp5enc3h000g5m78ejl55yfn');
INSERT INTO "_RolePermissions" ("A","B") VALUES('cmp7msruo000h5mosz7o980tn','cmp5enc3h000g5m78ejl55yfn');
CREATE TABLE IF NOT EXISTS "_PostToCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PostToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "BlogPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PostToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "PostCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "_PostToCategory" ("A","B") VALUES('cmp5kjqhs00035m0k50a9cf4r','cmpdixu2m00005m6oqvq5s90e');
INSERT INTO "_PostToCategory" ("A","B") VALUES('cmp5kjqhs00035m0k50a9cf4r','cmpdiy83s00015m6ofz7hbczr');
INSERT INTO "_PostToCategory" ("A","B") VALUES('cmp5kjqhs00035m0k50a9cf4r','cmpdiyghs00025m6o1ip6u7h1');
INSERT INTO "_PostToCategory" ("A","B") VALUES('cmpjbjxa70002qp0pxze79el8','cmpdixu2m00005m6oqvq5s90e');
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");
CREATE UNIQUE INDEX "PostCategory_name_key" ON "PostCategory"("name");
CREATE UNIQUE INDEX "_UserRoles_AB_unique" ON "_UserRoles"("A", "B");
CREATE INDEX "_UserRoles_B_index" ON "_UserRoles"("B");
CREATE UNIQUE INDEX "_RolePermissions_AB_unique" ON "_RolePermissions"("A", "B");
CREATE INDEX "_RolePermissions_B_index" ON "_RolePermissions"("B");
CREATE UNIQUE INDEX "_PostToCategory_AB_unique" ON "_PostToCategory"("A", "B");
CREATE INDEX "_PostToCategory_B_index" ON "_PostToCategory"("B");
