# 覆写配置

## Clash Party JavaScript 覆写

`Chunlion_OR_ClashParty.js` 用于扩展
[Chunlion_Rule-Set_DNS-Leak.yaml](https://github.com/Chunlion/Clash_Rule-Set/raw/refs/heads/main/Chunlion_Rule-Set_DNS-Leak.yaml)。

在 Clash Party 的“覆写”页面导入以下地址：

```text
https://raw.githubusercontent.com/hengruili2000/Custom_OpenClash_Rules/main/overwrite/Chunlion_OR_ClashParty.js
```

该脚本会：

- 添加 `custom_us_proxy` 规则集并分流至 `美国手动`；
- 添加 `f1_tv` 规则集并分流至 `Streaming`；
- 将两条规则插入 `geolocation-!cn` 之前；
- 继承源配置 `Anchor_CL` 的下载间隔和 `proxy` 设置。

源配置必须包含 `Anchor_CL`、`美国手动`、`Streaming`、`rules` 和
`proxy-groups`。脚本文件必须保留 `.js` 后缀，否则 Clash Party 会将其识别为
YAML 覆写而不会执行 `main(config)`。

## OpenClash 远程覆写归档

⚠️ **注意**：本目录下的远程覆写配置文件（`Custom_Overwrite.conf` 和
`Custom_Overwrite_NoIPv6.conf`）已于 2025-12-24 归档至 `archived` 子目录，
不再维护。

### 推荐配置方式

请使用以下方式配置 OpenClash：

1. **首选方案**：按照本项目 [Wiki](https://github.com/Aethersailor/Custom_OpenClash_Rules/wiki) 中的设置方案，配合[配置模板（INI）](https://raw.githubusercontent.com/Aethersailor/Custom_OpenClash_Rules/main/cfg/Custom_Clash.ini)进行配置
2. **远程覆写**：如需使用远程覆写配置文件，推荐使用 [Giveupmoon/OpenClash_Overwrite](https://github.com/Giveupmoon/OpenClash_Overwrite)
3. **参考配置**：查看 `cfg/yaml/Custom_Clash.yaml` 作为完整的配置文件参考

归档文件可在 `archived` 目录中查看。
