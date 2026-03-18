import { Component, Renderer2 } from '@angular/core';
import { MetabaseEmbedResponseDTO } from 'src/app/model/metabase/metabaseEmbedResponseDTO';
import { AvisosDialogService } from 'src/app/services/avisos-dialog.service';
import { LoadingService } from 'src/app/services/loading.service';
import { MetabaseService } from 'src/app/services/metabase.service';


@Component({
  selector: 'app-metabase-dash',
  templateUrl: './metabase-dash.component.html',
  styleUrls: ['./metabase-dash.component.css']
})
export class MetabaseDashComponent{

  metabaseToken?: string;
  metabaseInstanceUrl?: string;
  scriptLoaded = false;

  constructor(
    private metabaseService: MetabaseService,
    private loadingService: LoadingService,
    private avisoDialogService: AvisosDialogService,
    private renderer: Renderer2
  ) {}

  
  ngOnInit(): void {
    this.carregarConfiguracaoEmbed();
  }


  private carregarConfiguracaoEmbed(): void {
    this.loadingService.show();

    this.metabaseService.getDashboardToken().subscribe({
      next: (resposta: MetabaseEmbedResponseDTO) => {
        this.metabaseToken = resposta.token;
        this.metabaseInstanceUrl = resposta.instanceUrl;
        this.inicializarMetabase();
        this.loadingService.hide();
      },
      error: (error) => {
        this.loadingService.hide();
        console.error(error);
        this.avisoDialogService.notificar('Erro:', error);
      }
    });
  }


  private inicializarMetabase(): void {
    if ((window as any).defineMetabaseConfig) {
      (window as any).defineMetabaseConfig({
        theme: { preset: 'dark' },
        isGuest: true,
        instanceUrl: this.metabaseInstanceUrl
      });
      return;
    }

    const configScript = this.renderer.createElement('script');
    configScript.text = `
      function defineMetabaseConfig(config) {
        window.metabaseConfig = config;
      }
    `;
    this.renderer.appendChild(document.body, configScript);

    (window as any).defineMetabaseConfig({
      theme: { preset: 'dark' },
      isGuest: true,
      instanceUrl: this.metabaseInstanceUrl
    });

    const script = this.renderer.createElement('script');
    script.src = `${this.metabaseInstanceUrl}/app/embed.js`;
    script.defer = true;
    script.onload = () => {
      this.scriptLoaded = true;
    };

    this.renderer.appendChild(document.body, script);
  }


}
