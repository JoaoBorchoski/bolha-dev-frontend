import React from "react";
import { Switch } from "react-router-dom";
import Route from "./route";
import SignIn from "pages/authentication/sign-in";
import SignUp from "pages/authentication/sign-up";
import Home from "pages/authentication/home";
import Profile from "pages/authentication/profile";
import ForgotPassword from "pages/authentication/forgot-password";
import ResetPassword from "pages/authentication/reset-password";
import BlockReasonList from "pages/security/block-reason/list";
import BlockReasonForm from "pages/security/block-reason/form";
import UserGroupList from "pages/security/user-group/list";
import UserGroupForm from "pages/security/user-group/form";
import UserList from "pages/security/user/list";
import UserForm from "pages/security/user/form";
import ModuleList from "pages/security/module/list";
import ModuleForm from "pages/security/module/form";
import MenuOptionList from "pages/security/menu-option/list";
import MenuOptionForm from "pages/security/menu-option/form";
import ProfileList from "pages/security/profile/list";
import ProfileForm from "pages/security/profile/form";
import ProfileOptionList from "pages/security/profile-option/list";
import ProfileOptionForm from "pages/security/profile-option/form";
import UserProfileList from "pages/security/user-profile/list";
import UserProfileForm from "pages/security/user-profile/form";
import NavigationList from "pages/security/navigation/list";
import NavigationForm from "pages/security/navigation/form";
import VagaList from "pages/vagas/vaga/list";
import VagaForm from "pages/vagas/vaga/form";
import CandidaturaList from "pages/operacao/candidatura/list";
import CandidaturaForm from "pages/operacao/candidatura/form";
import PaisList from "pages/comum/pais/list";
import PaisForm from "pages/comum/pais/form";
import EstadoList from "pages/comum/estado/list";
import EstadoForm from "pages/comum/estado/form";
import CidadeList from "pages/comum/cidade/list";
import CidadeForm from "pages/comum/cidade/form";
import CepList from "pages/comum/cep/list";
import CepForm from "pages/comum/cep/form";
import NotFound from "pages/common/not-found";

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/signup" component={SignUp} />
    <Route path="/forgot-password" component={ForgotPassword} />
    <Route path="/reset-password" component={ResetPassword} />

    <Route exact path="/home" component={Home} isPrivate />
    <Route exact path="/profile" component={Profile} isPrivate />

    <Route exact path="/block-reasons" component={BlockReasonList} isPrivate />
    <Route
      exact
      path="/block-reasons/new"
      component={BlockReasonForm}
      isPrivate
    />
    <Route
      path="/block-reasons/edit/:id"
      component={BlockReasonForm}
      isPrivate
    />

    <Route exact path="/user-groups" component={UserGroupList} isPrivate />
    <Route exact path="/user-groups/new" component={UserGroupForm} isPrivate />
    <Route path="/user-groups/edit/:id" component={UserGroupForm} isPrivate />

    <Route exact path="/users" component={UserList} isPrivate />
    <Route exact path="/users/new" component={UserForm} isPrivate />
    <Route path="/users/edit/:id" component={UserForm} isPrivate />

    <Route exact path="/modules" component={ModuleList} isPrivate />
    <Route exact path="/modules/new" component={ModuleForm} isPrivate />
    <Route path="/modules/edit/:id" component={ModuleForm} isPrivate />

    <Route exact path="/menu-options" component={MenuOptionList} isPrivate />
    <Route
      exact
      path="/menu-options/new"
      component={MenuOptionForm}
      isPrivate
    />
    <Route path="/menu-options/edit/:id" component={MenuOptionForm} isPrivate />

    <Route exact path="/profiles" component={ProfileList} isPrivate />
    <Route exact path="/profiles/new" component={ProfileForm} isPrivate />
    <Route path="/profiles/edit/:id" component={ProfileForm} isPrivate />

    <Route
      exact
      path="/profile-options"
      component={ProfileOptionList}
      isPrivate
    />
    <Route
      exact
      path="/profile-options/new"
      component={ProfileOptionForm}
      isPrivate
    />
    <Route
      path="/profile-options/edit/:id"
      component={ProfileOptionForm}
      isPrivate
    />

    <Route exact path="/users-profiles" component={UserProfileList} isPrivate />
    <Route
      exact
      path="/users-profiles/new"
      component={UserProfileForm}
      isPrivate
    />
    <Route
      path="/users-profiles/edit/:id"
      component={UserProfileForm}
      isPrivate
    />

    <Route exact path="/navigations" component={NavigationList} isPrivate />
    <Route exact path="/navigations/new" component={NavigationForm} isPrivate />
    <Route path="/navigations/edit/:id" component={NavigationForm} isPrivate />

    <Route exact path="/vagas" component={VagaList} isPrivate />
    <Route exact path="/vagas/new" component={VagaForm} isPrivate />
    <Route path="/vagas/edit/:id" component={VagaForm} isPrivate />

    <Route exact path="/candidaturas" component={CandidaturaList} isPrivate />
    <Route
      exact
      path="/candidaturas/new"
      component={CandidaturaForm}
      isPrivate
    />
    <Route
      path="/candidaturas/edit/:id"
      component={CandidaturaForm}
      isPrivate
    />

    <Route exact path="/paises" component={PaisList} isPrivate />
    <Route exact path="/paises/new" component={PaisForm} isPrivate />
    <Route path="/paises/edit/:id" component={PaisForm} isPrivate />

    <Route exact path="/estados" component={EstadoList} isPrivate />
    <Route exact path="/estados/new" component={EstadoForm} isPrivate />
    <Route path="/estados/edit/:id" component={EstadoForm} isPrivate />

    <Route exact path="/cidades" component={CidadeList} isPrivate />
    <Route exact path="/cidades/new" component={CidadeForm} isPrivate />
    <Route path="/cidades/edit/:id" component={CidadeForm} isPrivate />

    <Route exact path="/ceps" component={CepList} isPrivate />
    <Route exact path="/ceps/new" component={CepForm} isPrivate />
    <Route path="/ceps/edit/:id" component={CepForm} isPrivate />

    <Route path="*" component={NotFound} isPrivate />
  </Switch>
);

export default Routes;
