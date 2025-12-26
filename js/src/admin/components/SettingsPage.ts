// js/src/admin/components/SettingsPage.ts
import app from 'flarum/admin/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import type Mithril from 'mithril';

interface CustomSettings {
  apiurl: string;
  CountryCode?: string; // 国家代码
  Region?: string; // 地区
  Isp?: string; // ISP
}

export default class SettingsPage extends Component {
  private settings: CustomSettings = {
    apiurl: 'https://api.example.com/v1/ip/{ip}',
    CountryCode: undefined,
    Region: undefined,
    Isp: undefined,
  };

  private isLoading = false;

  oninit(vnode: Mithril.Vnode<ComponentAttrs, this>) {
    super.oninit(vnode);

    // 初始化设置
    this.settings = {
      apiurl: app.data.settings['userip_custom_api_url'] || 'https://api.example.com/v1/ip/{ip}',
      CountryCode: app.data.settings['userip_custom_country_code'] || undefined,
      Region: app.data.settings['userip_custom_region'] || undefined,
      Isp: app.data.settings['userip_custom_isp'] || undefined,
    };
  }

  view() {
    return m('.SettingsPage', [
      m('.container', [
        m('.Form', [
          // API密钥
          m('.Form-group', [
            m('label', app.translator.trans('userip-custom.admin.apiurl_label')),
            m('input.FormControl', {
              type: 'text',
              value: this.settings.apiurl,
              oninput: (e: Event) => {
                this.settings.apiurl = (e.target as HTMLInputElement).value;
              },
              placeholder: app.translator.trans('userip-custom.admin.apiurl_placeholder'),
            }),
          ]),
          // 国家代码表达式
          m('.Form-group', [
            m('label', app.translator.trans('userip-custom.admin.country_code_expression_label')),
            m('input.FormControl', {
              type: 'text',
              value: this.settings.CountryCode,
              oninput: (e: Event) => {
                this.settings.CountryCode = (e.target as HTMLInputElement).value;
              },
              placeholder: app.translator.trans('userip-custom.admin.country_code_expression_placeholder'),
            }),
          ]),
          // 地区表达式
          m('.Form-group', [
            m('label', app.translator.trans('userip-custom.admin.region_expression_label')),
            m('input.FormControl', {
              type: 'text',
              value: this.settings.Region,
              oninput: (e: Event) => {
                this.settings.Region = (e.target as HTMLInputElement).value;
              },
              placeholder: app.translator.trans('userip-custom.admin.region_expression_placeholder'),
            }),
          ]),
          // ISP表达式
          m('.Form-group', [
            m('label', app.translator.trans('userip-custom.admin.isp_expression_label')),
            m('input.FormControl', {
              type: 'text',
              value: this.settings.Isp,
              oninput: (e: Event) => {
                this.settings.Isp = (e.target as HTMLInputElement).value;
              },
              placeholder: app.translator.trans('userip-custom.admin.isp_expression_placeholder'),
            }),
          ]),
          // 保存按钮
          m('.Form-group', [
            m(
              'button.Button.Button--primary',
              {
                onclick: this.save.bind(this),
                disabled: this.isLoading,
              },
              this.isLoading
                ? app.translator.trans('userip-custom.admin.save_settings_loading')
                : app.translator.trans('userip-custom.admin.save_settings_button')
            ),
          ]),
        ]),
      ]),
    ]);
  }

  private async save() {
    this.isLoading = true;

    try {
      await app.request({
        method: 'POST',
        url: app.forum.attribute('apiUrl') + '/settings',
        body: {
          'userip_custom_api_url': this.settings.apiurl,
          'userip_custom_country_code': this.settings.CountryCode,
          'userip_custom_region': this.settings.Region,
          'userip_custom_isp': this.settings.Isp,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      app.alerts.show(
        { type: 'success' },
        app.translator.trans('userip-custom.admin.save_settings_success')
      );

      // 重新加载页面以应用设置
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error('保存失败:', error);
      app.alerts.show(
        { type: 'error' },
        error.response?.errors?.[0]?.detail || app.translator.trans('userip-custom.admin.save_settings_error')
      );
    } finally {
      this.isLoading = false;
      m.redraw();
    }
  }
}