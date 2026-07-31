function main(config) {
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const isObject = (value) =>
    value !== null && typeof value === "object" && !Array.isArray(value);

  if (!isObject(config)) {
    throw new Error("源配置不是有效的配置对象");
  }

  if (!isObject(config.Anchor_CL)) {
    throw new Error("源配置中未找到有效的 Anchor_CL");
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
  // 保留 Anchor_CL 的下载间隔和代理设置，覆盖规则格式。
  const classicalYamlAnchor = {
    ...clone(config.Anchor_CL),
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
