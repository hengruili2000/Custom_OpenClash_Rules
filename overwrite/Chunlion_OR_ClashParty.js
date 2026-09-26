function main(config) {
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const isObject = (value) =>
    value !== null && typeof value === "object" && !Array.isArray(value);

  if (!isObject(config)) {
    throw new Error("源配置不是有效的配置对象");
  }

  // Clash Party 运行参数。对象字段与源配置合并；这里列出的字段和数组以本覆写为准。
  Object.assign(config, {
    port: 7890,
    "socks-port": 7891,
    "redir-port": 7892,
    "mixed-port": 7893,
    "allow-lan": false,
    mode: "rule",
    "log-level": "info",
    "external-controller": "127.0.0.1:9090",
    "unified-delay": true,
    ipv6: false
  });

  config.sniffer = {
    ...(isObject(config.sniffer) ? clone(config.sniffer) : {}),
    sniff: {
      TLS: { ports: [443], "override-destination": true },
      HTTP: { ports: [443], "override-destination": true }
    },
    enable: true,
    "parse-pure-ip": false,
    "force-dns-mapping": true,
    "override-destination": true
  };

  config["clash-for-android"] = {
    ...(isObject(config["clash-for-android"])
      ? clone(config["clash-for-android"])
      : {}),
    "append-system-dns": false
  };

  config.profile = {
    ...(isObject(config.profile) ? clone(config.profile) : {}),
    tracing: true
  };

  config.experimental = {
    ...(isObject(config.experimental) ? clone(config.experimental) : {}),
    "sniff-tls-sni": true
  };

  config.dns = {
    ...(isObject(config.dns) ? clone(config.dns) : {}),
    enable: true,
    ipv6: false,
    listen: "127.0.0.1:7874",
    "use-hosts": true,
    "use-system-hosts": false,
    nameserver: [
      "119.29.29.29",
      "223.5.5.5",
      "tls://119.29.29.29",
      "tls://223.5.5.5",
      "https://dns.pub/dns-query",
      "https://dns.alidns.com/dns-query"
    ],
    "proxy-server-nameserver": ["udp://127.0.0.1:7874"],
    "fake-ip-range": "198.18.0.0/15",
    "fake-ip-filter": [
      "*.lan",
      "*.localdomain",
      "*.example",
      "*.invalid",
      "*.localhost",
      "*.test",
      "*.local",
      "*.home.arpa",
      "time.*.com",
      "time.*.gov",
      "time.*.edu.cn",
      "time.*.apple.com",
      "time1.*.com",
      "time2.*.com",
      "time3.*.com",
      "time4.*.com",
      "time5.*.com",
      "time6.*.com",
      "time7.*.com",
      "ntp.*.com",
      "ntp1.*.com",
      "ntp2.*.com",
      "ntp3.*.com",
      "ntp4.*.com",
      "ntp5.*.com",
      "ntp6.*.com",
      "ntp7.*.com",
      "*.time.edu.cn",
      "*.ntp.org.cn",
      "+.pool.ntp.org",
      "time1.cloud.tencent.com",
      "stun.*.*",
      "stun.*.*.*",
      "swscan.apple.com",
      "mesu.apple.com",
      "music.163.com",
      "*.music.163.com",
      "*.126.net",
      "musicapi.taihe.com",
      "music.taihe.com",
      "songsearch.kugou.com",
      "trackercdn.kugou.com",
      "*.kuwo.cn",
      "api-jooxtt.sanook.com",
      "api.joox.com",
      "y.qq.com",
      "*.y.qq.com",
      "streamoc.music.tc.qq.com",
      "mobileoc.music.tc.qq.com",
      "isure.stream.qqmusic.qq.com",
      "dl.stream.qqmusic.qq.com",
      "aqqmusic.tc.qq.com",
      "amobile.music.tc.qq.com",
      "localhost.ptlogin2.qq.com",
      "*.msftconnecttest.com",
      "*.msftncsi.com",
      "*.xiami.com",
      "*.music.migu.cn",
      "music.migu.cn",
      "+.wotgame.cn",
      "+.wggames.cn",
      "+.wowsgame.cn",
      "+.wargaming.net",
      "*.*.*.srv.nintendo.net",
      "*.*.stun.playstation.net",
      "xbox.*.*.microsoft.com",
      "*.*.xboxlive.com",
      "*.ipv6.microsoft.com",
      "teredo.*.*.*",
      "teredo.*.*",
      "speedtest.cros.wr.pvp.net",
      "+.jjvip8.com",
      "www.douyu.com",
      "activityapi.huya.com",
      "activityapi.huya.com.w.cdngslb.com",
      "www.bilibili.com",
      "api.bilibili.com",
      "a.w.bilicdn1.com",
      "+.apt-agent.com"
    ],
    "enhanced-mode": "fake-ip"
  };

  const classicalRuleAnchor = isObject(config.Anchor_CL)
    ? clone(config.Anchor_CL)
    : isObject(config.Anchor_DN)
      ? clone(config.Anchor_DN)
      : null;

  if (!classicalRuleAnchor) {
    throw new Error("源配置中未找到有效的 Anchor_CL 或 Anchor_DN");
  }

  if (!Array.isArray(config["proxy-groups"])) {
    throw new Error("源配置中未找到有效的 proxy-groups");
  }

  if (!Array.isArray(config.rules)) {
    throw new Error("源配置中未找到有效的 rules");
  }

  if (!isObject(config["proxy-providers"])) {
    throw new Error("源配置中未找到有效的 proxy-providers");
  }

  const proxyProviderName = "机场1";
  const proxyProvider = config["proxy-providers"][proxyProviderName];

  if (!isObject(proxyProvider)) {
    throw new Error(`源配置中未找到 proxy-provider: ${proxyProviderName}`);
  }

  // 保留 Anchor_PR 展开的健康检查、过滤器和节点前缀，仅替换订阅地址。
  config["proxy-providers"][proxyProviderName] = {
    ...clone(proxyProvider),
    url: "http://127.0.0.1:38324/download/AIO"
  };

  if (!isObject(config.Anchor_OB)) {
    throw new Error("源配置中未找到有效的 Anchor_OB");
  }

  const f1TvGroupName = "F1 TV";
  const f1TvGroup = {
    ...clone(config.Anchor_OB),
    name: f1TvGroupName
  };
  const existingF1TvGroupIndex = config["proxy-groups"].findIndex(
    (group) => group?.name === f1TvGroupName
  );

  if (existingF1TvGroupIndex === -1) {
    const streamingGroupIndex = config["proxy-groups"].findIndex(
      (group) => group?.name === "Streaming"
    );
    const insertIndex =
      streamingGroupIndex === -1
        ? config["proxy-groups"].length
        : streamingGroupIndex + 1;
    config["proxy-groups"].splice(insertIndex, 0, f1TvGroup);
  } else {
    config["proxy-groups"][existingF1TvGroupIndex] = f1TvGroup;
  }

  const requiredGroups = ["PayPal"];
  const groupNames = new Set(
    config["proxy-groups"]
      .map((group) => group?.name)
      .filter((name) => typeof name === "string")
  );
  const missingGroups = requiredGroups.filter((name) => !groupNames.has(name));

  if (missingGroups.length > 0) {
    throw new Error(`源配置缺少策略组: ${missingGroups.join(", ")}`);
  }

  if (!isObject(config["rule-providers"])) {
    config["rule-providers"] = {};
  }

  // 两个远程规则文件均为 classical payload YAML。
  // 优先沿用旧版 Anchor_CL；新版移除该锚点后回退到 Anchor_DN。
  // 保留下载间隔、大小限制和代理设置，只覆盖规则行为与格式。
  const classicalYamlAnchor = {
    ...classicalRuleAnchor,
    behavior: "classical",
    format: "yaml"
  };

  const providers = {
    custom_us_proxy: {
      ...clone(classicalYamlAnchor),
      url: "https://raw.githubusercontent.com/hengruili2000/Custom_OpenClash_Rules/refs/heads/main/rule/Custom_US_Proxy.yaml"
    },
    f1_tv: {
      ...clone(classicalYamlAnchor),
      url: "https://raw.githubusercontent.com/vxiaov/vClash/5294957bd48ff61e71938cfd1f68cfe2e44b8acb/clash/clash/ruleset/F1_TV"
    }
  };

  Object.assign(config["rule-providers"], providers);

  const managedProviderNames = new Set(Object.keys(providers));

  // 先移除本覆写管理的旧规则，再按当前定义重新插入，确保升级和重复执行幂等。
  config.rules = config.rules.filter((rule) => {
    if (typeof rule !== "string") {
      return true;
    }

    const [type, providerName] = rule.split(",");
    return type !== "RULE-SET" || !managedProviderNames.has(providerName);
  });

  const newRules = [
    "RULE-SET,custom_us_proxy,PayPal",
    "RULE-SET,f1_tv,F1 TV"
  ];

  // 优先于通用国外规则；若源配置结构变化，则回退到 MATCH 前或末尾。
  let insertIndex = config.rules.findIndex(
    (rule) =>
      typeof rule === "string" &&
      rule.startsWith("RULE-SET,geolocation-!cn,")
  );

  if (insertIndex === -1) {
    insertIndex = config.rules.findIndex(
      (rule) => typeof rule === "string" && rule.startsWith("MATCH,")
    );
  }

  if (insertIndex === -1) {
    insertIndex = config.rules.length;
  }

  config.rules.splice(insertIndex, 0, ...newRules);

  return config;
}
