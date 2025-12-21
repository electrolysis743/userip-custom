// js/src/admin/components/SettingsPage.ts
import app from 'flarum/admin/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import type Mithril from 'mithril';

interface CustomSettings {
  apiurl: string;
  CountryCode_expression?: string; //国家代码
  Region_expression?: string; //地区
  Isp_expression?: string; //ISP
}

export default class SettingsPage extends Component {
  private settings: CustomSettings = {
    apiurl: 'https://api.example.com/v1/ip/{ip}',
    CountryCode_expression: undefined,
    Region_expression: undefined,
    Isp_expression: undefined
  };

  private isLoading = false;

  oninit(vnode: Mithril.Vnode<ComponentAttrs, this>) {
    super.oninit(vnode);
    
    // 初始化设置
    this.settings = {
      apiurl: app.data.settings['userip-custom.api_url'] || 'https://api.example.com/v1/ip/{ip}',
      CountryCode_expression: app.data.settings['userip-custom.country_code_expression'] || undefined,
      Region_expression: app.data.settings['userip-custom.region_expression'] || undefined,
      Isp_expression: app.data.settings['userip-custom.isp_expression'] || undefined
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
              placeholder: app.translator.trans('userip-custom.admin.apiurl_placeholder')
            })
          ]),
            // 国家代码表达式
          m('.Form-group', [
            m('label', app.translator.trans('userip-custom.admin.country_code_expression_label')),
            m('input.FormControl', {
              type: 'text',
              value: this.settings.CountryCode_expression,
              oninput: (e: Event) => {
                this.settings.CountryCode_expression = (e.target as HTMLInputElement).value;
              },
              placeholder: app.translator.trans('userip-custom.admin.country_code_expression_placeholder')
            })
          ]),
            // 地区表达式
          m('.Form-group', [
            m('label', app.translator.trans('userip-custom.admin.region_expression_label')),
            m('input.FormControl', {
              type: 'text',
              value: this.settings.Region_expression,
              oninput: (e: Event) => {
                this.settings.Region_expression = (e.target as HTMLInputElement).value;
              },
              placeholder: app.translator.trans('userip-custom.admin.region_expression_placeholder')
            })
          ]),
            // ISP表达式
          m('.Form-group', [
            m('label', app.translator.trans('userip-custom.admin.isp_expression_label')),
            m('input.FormControl', {
              type: 'text',
              value: this.settings.Isp_expression,
              oninput: (e: Event) => {
                this.settings.Isp_expression = (e.target as HTMLInputElement).value;
              },
              placeholder: app.translator.trans('userip-custom.admin.isp_expression_placeholder')
            })
          ]),
          // 保存按钮
          m('.Form-group', [
            m('button.Button.Button--primary', {
              onclick: this.save.bind(this),
              disabled: this.isLoading
            }, this.isLoading ? app.translator.trans('userip-custom.admin.save_settings_loading') : app.translator.trans('userip-custom.admin.save_settings_button'))
          ])
        ])
      ])
    ]);
  }

  private async save() {
    this.isLoading = true;

    try {
      await app.request({
        method: 'POST',
        url: app.forum.attribute('apiUrl') + '/settings',
        body: {
          'userip-custom.api_url': this.settings.apiurl,
          'userip-custom.country_code_expression': this.settings.CountryCode_expression,
          'userip-custom.region_expression': this.settings.Region_expression,
          'userip-custom.isp_expression': this.settings.Isp_expression
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      app.alerts.show(
        { type: 'success' },
        app.translator.trans('userip-custom.admin.save_settings_success')
      );

      // 重新加载页面以应用设置
      setTimeout(() => {
        // m.redraw(); // 或者仅重绘
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