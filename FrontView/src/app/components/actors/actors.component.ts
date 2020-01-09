import { instrumento } from './../../models/instrumentos';
import { musico } from './../../models/musico';
import { deportes } from './../../models/deportes';
import { deportista } from './../../models/deportista';
import { Component, NgModule, Input, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material';
import { invalid } from '@angular/compiler/src/render3/view/util';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { AuthService } from '../../Services/auth.service';
import { Usuario } from 'src/app/models/usuario';
import { bailarin } from 'src/app/models/bailarin';
import { estilosBaile } from 'src/app/models/estilosBaile';
import { cantante } from 'src/app/models/cantante';
import { estilosCanto } from 'src/app/models/estilosCanto';
import { habilidades } from 'src/app/models/habilidades';
import { idiomas } from 'src/app/models/idiomas';
import { AngularFireStorage } from '@angular/fire/storage';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

// custom validator to check that two fields match
export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }
    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  }
}

@Component({
  selector: 'app-actors',
  templateUrl: './actors.component.html',
  styleUrls: ['./actors.component.css']
})
export class ActorsComponent implements OnInit {

  @ViewChild(TemplateRef, { static: false }) tpl: TemplateRef<any>;

  actorForm: FormGroup;
  submitted = false;
  disa = false;
  matcher = new MyErrorStateMatcher();

  /***variables para carga de imagenes y archivos */
  fileAvatar: File = null;
  fileCoche: File = null;
  fileMoto: File = null;
  fileTatuajes: File = null;
  fileManos: File = null;
  fileCuerpoEntero: File = null;
  fileArtistico: File = null;


  urlAvatar: string;
  urlMoto: string;
  urlCoche: string;
  urlTatuajes: string;
  urlManos: string;
  urlCuerpoEntero: string;
  urlArtistico: string;

  /*******variables para combos********/
  etnias;
  baile;
  estilosBaile;
  cantante;
  estilosCanto;
  habilidadess;
  idiomas;
  deportista;
  deportes;
  musico;
  instrumentoss;
  typecarnet: string[] = ['Tipo A', 'Tipo B', 'Tipo C', 'Tipo D', 'Tipo BTP'];
  actor = [{ name: 'Si', value: 0 }, { name: 'No', value: 1 }];
  //selected
  actorSelect;
  tipoCarnetSelect;
  etniaSelect;
  usuario: Usuario;
  baileSelect: bailarin;
  estilosBaileSelect: estilosBaile;
  cantanteSelect: cantante;
  estilosCantoSelect: estilosCanto;
  habilidadessSelect: habilidades;
  idiomasSelect: idiomas;
  deportistaSelect: deportista;
  deporteSelect: deportes;
  musicoSelect: musico;
  instrumentoSelect: instrumento;
  /*****fin variables combos*****/
  constructor(
    private storage: AngularFireStorage,
    private authService: AuthService,
    public ngxSmartModalService: NgxSmartModalService,
    private formBuilder: FormBuilder,
    private router: Router,

  ) {
    this.createRegisterForm();
  }
  ngOnInit() {
    this.llenarCombos();
  }

  /**Upload avatar */
  onFileAvatarSelected(event) {
    this.fileAvatar = event.target.files[0] as File;
  }
  /**Upload foto cuerpo entero */
  onFileCuerpoEnteroSelected(event) {
    this.fileCuerpoEntero = event.target.files[0] as File;
  }

  /**Upload foto artistica */
  onFileArtisticoSelected(event) {
    this.fileArtistico = event.target.files[0] as File;
  }

  /**Upload foto moto */
  onFileMotoSelected(event) {
    this.fileMoto = event.target.files[0] as File;
  }

  /**Upload foto coche */
  onFileCocheSelected(event) {
    this.fileCoche = event.target.files[0] as File;
  }

  /**Upload foto tatuajes */
  onFileTatuajeSelected(event) {
    this.fileTatuajes = event.target.files[0] as File;
  }

  /**Upload foto manos */
  onFileManoSelected(event) {
    this.fileManos = event.target.files[0] as File;
  }

  llenarCombos() {

    //llenado de etnias
    this.authService.getAllEtinas()
      .subscribe(resp => {
        this.etnias = resp;
      });

    this.authService.finByIdEtnia(1)
      .subscribe(resp => {
        this.etniaSelect = resp;
      });

    //llenado de baile
    this.authService.getAllBailarin()
      .subscribe(resp => {
        this.baile = resp;
      });

    this.authService.finByIdBailarin(1)
      .subscribe(resp => {
        this.baileSelect = resp;
      });


    //llenado de estilos baile
    this.authService.getAllEstilosBailes()
      .subscribe(resp => {
        this.estilosBaile = resp;
      });

    this.authService.finByIdEstilosBile(1)
      .subscribe(resp => {
        this.estilosBaileSelect = resp;
      });

    //llenado de cantate
    this.authService.getAllCantante()
      .subscribe(resp => {
        this.cantante = resp;
      });

    this.authService.finByIdCantante(1)
      .subscribe(resp => {
        this.cantanteSelect = resp;
      });

    //llenado de estilosCanto
    this.authService.getAllEstilosCanto()
      .subscribe(resp => {
        this.estilosCanto = resp;
      });

    this.authService.finByIdEstilosCanto(1)
      .subscribe(resp => {
        this.estilosCantoSelect = resp;
      });

    //llenado de habilidadess
    this.authService.getAllHabilidades()
      .subscribe(resp => {
        this.habilidadess = resp;
      });

    this.authService.finByIdHabilidades(1)
      .subscribe(resp => {
        this.habilidadessSelect = resp;
      });

    //llenado de idiomas
    this.authService.getAllIdiomas()
      .subscribe(resp => {
        this.idiomas = resp;
      });

    this.authService.finByIdIdiomas(1)
      .subscribe(resp => {
        this.idiomasSelect = resp;
      });

    //llenado de deportista
    this.authService.getAllDeportista()
      .subscribe(resp => {
        this.deportista = resp;
      });

    this.authService.finByIdDeportista(1)
      .subscribe(resp => {
        this.deportistaSelect = resp;
      });

    //llenado de deportes
    this.authService.getAllDeportes()
      .subscribe(resp => {
        this.deportes = resp;
      });

    this.authService.finByIdDeportes(1)
      .subscribe(resp => {
        this.deporteSelect = resp;
      });

    //llenado de musico
    this.authService.getAllMusico()
      .subscribe(resp => {
        this.musico = resp;
      });

    this.authService.finByIdMusico(1)
      .subscribe(resp => {
        this.musicoSelect = resp;
      });

    //llenado de instrumento
    this.authService.getAllInstrumentos()
      .subscribe(resp => {
        this.instrumentoss = resp;
      });

    this.authService.finByIdInstrumento(1)
      .subscribe(resp => {
        this.instrumentoSelect = resp;
      });
  }

  createRegisterForm() {
    this.actorForm = this.formBuilder.group({
      /****variables nuevas */
      etnias: [''],
      baile: [''],
      estilosBaile: [''],
      cantante: [''],
      estilosCanto: [''],
      habilidadess: [''],
      idiomas: [''],
      deportista: [''],
      deportes: [''],
      musico: [''],
      instrumentoss: [''],
      /****fin variables nuevas */
      email: ['', [Validators.required, Validators.email, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue],
      bailes: [''],
      etnico: [''],
      placebirth: [''],
      habilidades: [''],
      username: ['', Validators.required],
      nombres: ['', [Validators.required, Validators.minLength(3)]],
      estilobailes: [''],
      cantos: [''],
      estilocantos: [''],
      instrumentos: [''],
      deporte: [''],
      apellidos: [''],
      nombreArtistico: [''],
      sexo: [''],
      telefono: [''],
      fechaNacimiento: [''],
      nacionalidad: [''],
      localidad: [''],
      videoBook: [''],
      provincia: [''],
      codpostal: [''],
      direccion: [''],
      acento: [''],
      tallaPantalon: [''],
      tallaCamisa: [''],
      tallaChaqueta: [''],
      pie: [''],
      tattoos: [''],
      avatar: [''],
      habdeportes: [''],
      altura: [''],
      musicos: [''],
      colorPiel: [''],
      colorPelo: [''],
      colorOjos: [''],
      numeroDNI: [''],
      numeroSeguridadSocial: [''],
      carnetConducir: [''],
      modeloCoche: [''],
      colorCoche: [''],
      modeloMoto: [''],
      colorMoto: [''],
      ultimosTrabajos: [''],
    }

      , {
        validator: MustMatch('password', 'confirmPassword')
      });

  }

  pasarDatosFormUsuario() {
    console.log('DATOS DE ETNIA' + this.etniaSelect.idEtnia);
    this.submitted = true;
    /*if (this.actorForm.invalid) {
      return;
    }*/
    const newUserObject = this.actorForm.value;

    this.usuario = {
      idUser: 0,
      avatar: this.urlAvatar,
      acento: newUserObject.acento,
      altura: newUserObject.altura,
      apellidos: newUserObject.apellidos,
      carnetConducir: newUserObject.carnetConducir,
      codigoPostal: newUserObject.codpostal,
      colorOjos: newUserObject.colorOjos,
      colorPelo: newUserObject.colorPelo,
      colorPiel: newUserObject.colorPiel,
      curriculumVitae: '',
      direccion: newUserObject.direccion,
      dniMadre: '',
      dniRepresentante: '',
      dniPadre: '',
      dniUser: newUserObject.numeroDNI,
      email: newUserObject.email,
      fechaNacimiento: newUserObject.fechaNacimiento,
      libroFamilia: '',
      localidad: newUserObject.localidad,
      nacionalidad: newUserObject.nacionalidad,
      nombreArtistico: '',
      nombreCompleto: '',
      nombres: newUserObject.nombres,
      numeroSeguroSocial: newUserObject.numeroSeguridadSocial,
      observaciones: '',
      password: newUserObject.password,
      pathDniMadre: '',
      pathDniPadre: '',
      pathDniUser: '',
      pathDniRepresentante: '',
      pathSeguroSocial: '',
      provincia: newUserObject.provincia,
      sexo: newUserObject.sexo,
      telefono: newUserObject.telefono,
      telefonoMadre: '',
      telefonoPadre: '',
      lugarNacimiento: newUserObject.placebirth,
      edad: 0,
      actor: '',
      username: newUserObject.username,
      videobook: '',
      instrumentoList: [],
      estilosCantoList: [this.estilosCantoSelect],
      deporteList: [this.deporteSelect],
      estiloBaileList: [this.estilosBaileSelect],
      idiomasList: [this.idiomasSelect],
      habilidadesList: [this.habilidadessSelect],
      tallasList: [],
      ultimosTrabajosList: [],
      idCantante: this.cantanteSelect,
      idBailarin: this.baileSelect,
      idEtnia: this.etniaSelect,

      idType: {
        idType: 1,
        description: 'ACTOR',
        nombres: 'ACTOR'
      },
      idDeportista: this.deportistaSelect,
      idMusico: this.musicoSelect,
      motoList: [],
      cocheList: [],
      fotosTatuajesList: [],
      fotosManosList: []
    };
  }

  guardarTalla(idUser) {
    const newChild = this.actorForm.value;
    let tallas = {
      camisaTalla: newChild.tallaCamisa,
      chaquetaTalla: newChild.tallaChaqueta,
      pantalonTalla: newChild.tallaPantalon,
      pieTalla: newChild.pie,
      idUser: idUser
    };
    this.authService.saveTalla(tallas).subscribe(
      resTalla => {
        console.log('talla guardada');
      },
      (err) => {
        this.ngxSmartModalService.create('confirm', 'Se ha presentado un Error, vuelva a intentarlo y si el problema persiste, contáctenos').open();
        console.log(JSON.stringify(err));
      });
  }

  registrarFotos(idUser) {
    if (this.urlMoto !== '') {
      let moto = {
        colorMoto: this.actorForm.get('colorMoto').value,
        fotoMoto: this.urlMoto,
        modeloMoto: this.actorForm.get('modeloMoto').value,
        idUser: idUser
      };

      /***GUARDE CON SERVICIO */
      this.authService.saveMoto(moto).subscribe(
        resTalla => {
          console.log('info save moto');
        },
        (err) => {
          console.log('error save moto');
        });
    }

    if (this.urlCoche !== '') {
      let coche = {
        colorCoche: this.actorForm.get('colorCoche').value,
        fotoCoche: this.urlCoche,
        modeloCoche: this.actorForm.get('modeloCoche').value,
        idUser: idUser
      };

      /***GUARDE CON SERVICIO */
      this.authService.saveCoche(coche).subscribe(
        resTalla => {
          console.log('info save coche');
        },
        (err) => {
          console.log('error save coche');
        });
    }

    if (this.urlTatuajes !== '') {
      let fotosTatuajes = {
        fechaCargaTatuaje: new Date(),
        nombreFotoTatuaje: 'tatuaje' + idUser,
        urlFotoTatuaje: this.urlTatuajes,
        idUser: idUser
      };

      /***GUARDE CON SERVICIO */
      this.authService.saveTatuajes(fotosTatuajes).subscribe(
        resTalla => {
          console.log('info save fotosTatuajes');
        },
        (err) => {
          console.log('error save fotosTatuajes');
        });
    }


    if (this.urlManos !== '') {
      let fotosManos = {
        fechaCargaMano: new Date(),
        nombreFotoMano: 'manos' + idUser,
        urlFotoMano: this.urlManos,
        idUser: idUser
      };

      /***GUARDE CON SERVICIO */
      this.authService.saveManos(fotosManos).subscribe(
        resTalla => {
          console.log('info save fotosManos');
        },
        (err) => {
          console.log('error save fotosManos');
        });
    }

  }


  registrarActor() {

    this.submitted = true;

    if (this.actorForm.invalid || this.actorForm.get('acceptTerms').value === false) {
      this.ngxSmartModalService.create('confirm', 'Pofavor, Llenar el formulario con todos los datos').open();
      return;
    }

    this.subirArchivos();
    this.pasarDatosFormUsuario();
    this.authService.signup2(this.usuario).subscribe(
      res => {
        this.registrarFotos(res.idUser);
        this.guardarTalla(res.idUser);
        localStorage.setItem('token', res.idUser);
        this.router.navigate(['/homeuser']);
        this.ngxSmartModalService.create('confirm', 'Se ha registrado exitosamente' + this.usuario.nombreCompleto).open();

      },
      (err) => {
        this.ngxSmartModalService.create('confirm', 'Se ha presentado un Error, vuelva a intentarlo y si el problema persiste, contáctenos').open();
        console.log(JSON.stringify(err));
      });
  }

  subirArchivos() {
    /**subir avatar */
    let idUser = this.actorForm.get('numeroDNI').value;
    this.urlAvatar = 'actor/' + idUser + '/avatar-' + this.fileAvatar.name;
    let task = this.storage.upload(this.urlAvatar, this.fileAvatar);

    /**subir cuerpo entero */
    this.urlCuerpoEntero = 'actor/' + idUser + '/cuerpo-' + this.fileCuerpoEntero.name;
    task = this.storage.upload(this.urlCuerpoEntero, this.fileCuerpoEntero);

    /**subir foto artistica */
    this.urlArtistico = 'actor/' + idUser + '/artistico-' + this.fileArtistico.name;
    task = this.storage.upload(this.urlArtistico, this.fileArtistico);

    /**subir coche */
    this.urlCoche = 'actor/' + idUser + '/coche-' + this.fileCoche.name;
    task = this.storage.upload(this.urlCoche, this.fileCoche);

    /**subir moto */
    this.urlMoto = 'actor/' + idUser + '/moto-' + this.fileMoto.name;
    task = this.storage.upload(this.urlMoto, this.fileMoto);

    /**subir tatuajes */
    this.urlTatuajes = 'actor/' + idUser + '/tatuajes-' + this.fileTatuajes.name;
    task = this.storage.upload(this.urlTatuajes, this.fileTatuajes);

    /**subir manos */
    this.urlManos = 'actor/' + idUser + '/manos-' + this.fileManos.name;
    task = this.storage.upload(this.urlManos, this.fileManos);



  }

  /*  Función para permitir solo numeros */
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  /*  Función para no permitir caracteres especiales */
  check(e) {
    const tecla = (document.all) ? e.keyCode : e.which;
    //Tecla de retroceso para borrar, siempre la permite
    if (tecla == 8) {
      return true;
    }
    // Patron de entrada, en este caso solo acepta numeros y letras
    const patron = /[A-Za-z0-9]/;
    const tecla_final = String.fromCharCode(tecla);
    return patron.test(tecla_final);
  }

}
