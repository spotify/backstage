{{/*
Expand the name of the chart.
*/}}
{{- define "backstage.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "backstage.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "backstage.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Common App labels
*/}}
{{- define "backstage.app.labels" -}}
app.kubernetes.io/name: {{ include "backstage.name" . }}-app
helm.sh/chart: {{ include "backstage.chart" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{/*
Common Backend labels
*/}}
{{- define "backstage.backend.labels" -}}
app.kubernetes.io/name: {{ include "backstage.name" . }}-backend
helm.sh/chart: {{ include "backstage.chart" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{/*
Name for postgresql dependency
See https://github.com/helm/helm/issues/3920#issuecomment-686913512
*/}}
{{- define "backstage.postgresql.fullname" -}}
{{ printf "%s-%s" .Release.Name .Values.postgresql.nameOverride }}
{{- end -}}


{{/*
Create the name of the service account to use for the app
*/}}
{{- define "backstage.app.serviceAccountName" -}}
{{- if .Values.app.serviceAccount.create -}}
    {{ default "default" .Values.app.serviceAccount.name }}
{{- else -}}
    {{ default "default" .Values.app.serviceAccount.name }}
{{- end -}}
{{- end -}}

{{/*
Create the name of the service account to use for the backend
*/}}
{{- define "backstage.backend.serviceAccountName" -}}
{{- if .Values.backend.serviceAccount.create -}}
    {{ default default .Values.backend.serviceAccount.name }}
{{- else -}}
    {{ default "default" .Values.backend.serviceAccount.name }}
{{- end -}}
{{- end -}}

{{/*
Path to the CA certificate file in the backend
*/}}
{{- define "backstage.backend.postgresCaFilename" -}}
{{ include "backstage.backend.postgresCaDir" . }}/{{- required "The name for the CA certificate file for postgresql is required" .Values.global.postgresql.caFilename }}
{{- end -}}
{{/*

{{/*
Directory path to the CA certificate file in the backend
*/}}
{{- define "backstage.backend.postgresCaDir" -}}
{{- if .Values.appConfig.backend.database.connection.ssl.ca -}}
    {{ .Values.appConfig.backend.database.connection.ssl.ca }}
{{- else -}}
/etc/postgresql
{{- end -}}
{{- end -}}
{{/*

Path to the CA certificate file in lighthouse
*/}}
{{- define "backstage.lighthouse.postgresCaFilename" -}}
{{ include "backstage.lighthouse.postgresCaDir" . }}/{{- required "The name for the CA certificate file for postgresql is required" .Values.global.postgresql.caFilename }}
{{- end -}}

{{/*
Directory path to the CA certificate file in lighthouse
*/}}
{{- define "backstage.lighthouse.postgresCaDir" -}}
{{- if .Values.lighthouse.database.pathToDatabaseCa -}}
    {{ .Values.lighthouse.database.pathToDatabaseCa }}
{{- else -}}
/etc/postgresql
{{- end -}}
{{- end -}}
{{/*

{{/*
Generate ca for postgresql
*/}}
{{- define "backstage.postgresql.generateCA" -}}
{{- $ca := .ca | default (genCA (include "backstage.postgresql.fullname" .) 365) -}}
{{- $_ := set . "ca" $ca -}}
{{- $ca.Cert -}}
{{- end -}}

{{/*
Generate certificates for postgresql
*/}}
{{- define "generateCerts" -}}
{{- $postgresName := (include "backstage.postgresql.fullname" .) }}
{{- $altNames := list $postgresName ( printf "%s.%s" $postgresName .Release.Namespace ) ( printf "%s.%s.svc" ( $postgresName ) .Release.Namespace ) -}}
{{- $ca := .ca | default (genCA (include "backstage.postgresql.fullname" .) 365) -}}
{{- $_ := set . "ca" $ca -}}
{{- $cert := genSignedCert ( $postgresName ) nil $altNames 365 $ca -}}
tls.crt: {{ $cert.Cert | b64enc }}
tls.key: {{ $cert.Key | b64enc }}
{{- end -}}

{{/*
Generate a password for the postgres user used for the connections from the backend and lighthouse
*/}}
{{- define "postgresql.generateUserPassword" -}}
{{- $pgPassword := .pgPassword | default ( randAlphaNum 12 ) -}}
{{- $_ := set . "pgPassword" $pgPassword -}}
{{ $pgPassword}}
{{- end -}}

{{/*
Name of the backend service
*/}}
{{- define "backend.serviceName" -}}
{{ include "backstage.fullname" . }}-backend
{{- end -}}

{{/*
Name of the frontend service
*/}}
{{- define "frontend.serviceName" -}}
{{ include "backstage.fullname" . }}-frontend
{{- end -}}

{{/*
Name of the lighthouse backend service
*/}}
{{- define "lighthouse.serviceName" -}}
{{ include "backstage.fullname" . }}-lighthouse
{{- end -}}

{{/*
Name of the postgresql service
*/}}
{{- define "postgresql.serviceName" -}}
{{- include "backstage.postgresql.fullname" . }}
{{- end -}}

{{/*
Postgres host for lighthouse
*/}}
{{- define "lighthouse.postgresql.host" -}}
{{- if .Values.postgresql.enabled }}
{{- include "postgresql.serviceName" . }}
{{- else -}}
{{- required "A valid .Values.lighthouse.database.connection.host is required when postgresql is not enabled" .Values.lighthouse.database.connection.host -}}
{{- end -}}
{{- end -}}

{{/*
Postgres host for the backend
*/}}
{{- define "backend.postgresql.host" -}}
{{- if .Values.postgresql.enabled }}
{{- include "postgresql.serviceName" . }}
{{- else -}}
{{- required "A valid .Values.appConfig.backend.database.connection.host is required when postgresql is not enabled" .Values.appConfig.backend.database.connection.host -}}
{{- end -}}
{{- end -}}

{{/*
Postgres port for the backend
*/}}
{{- define "backend.postgresql.port" -}}
{{- if .Values.postgresql.enabled }}
{{- .Values.postgresql.service.port }}
{{- else if .Values.appConfig.backend.database.connection.port -}}
{{- .Values.appConfig.backend.database.connection.port }}
{{- else -}}
5432
{{- end -}}
{{- end -}}

{{/*
Postgres port for lighthouse
*/}}
{{- define "lighthouse.postgresql.port" -}}
{{- if .Values.postgresql.enabled }}
{{- .Values.postgresql.service.port }}
{{- else if .Values.lighthouse.database.connection.port -}}
{{- .Values.lighthouse.database.connection.port }}
{{- else -}}
5432
{{- end -}}
{{- end -}}

{{/*
Postgres user for backend
*/}}
{{- define "backend.postgresql.user" -}}
{{- if .Values.postgresql.enabled }}
{{- .Values.global.postgresql.postgresqlUsername }}
{{- else -}}
{{- required "A valid .Values.appConfig.backend.database.connection.user is required when postgresql is not enabled" .Values.appConfig.backend.database.connection.user -}}
{{- end -}}
{{- end -}}

{{/*
Postgres user for lighthouse
*/}}
{{- define "lighthouse.postgresql.user" -}}
{{- if .Values.postgresql.enabled }}
{{- .Values.global.postgresql.postgresqlUsername }}
{{- else -}}
{{- required "A valid .Values.lighthouse.database.connection.user is required when postgresql is not enabled" .Values.lighthouse.database.connection.user -}}
{{- end -}}
{{- end -}}

{{/*
Postgres password secret for backend
*/}}
{{- define "backend.postgresql.passwordSecret" -}}
{{- if .Values.postgresql.enabled }}
{{- template "backstage.postgresql.fullname" . }}
{{- else -}}
{{ $secretName := (printf "%s-backend-postgres" (include "backstage.fullname" . )) }}
{{- required "A valid .Values.appConfig.backend.database.connection.password is required when postgresql is not enabled" $secretName -}}
{{- end -}}
{{- end -}}

{{/*
Postgres password for lighthouse
*/}}
{{- define "lighthouse.postgresql.passwordSecret" -}}
{{- if .Values.postgresql.enabled }}
{{- template "backstage.postgresql.fullname" . }}
{{- else -}}
{{ $secretName := (printf "%s-lighthouse-postgres" (include "backstage.fullname" . )) }}
{{- required "A valid .Values.lighthouse.database.connection.password is required when postgresql is not enabled" $secretName -}}
{{- end -}}
{{- end -}}

{{/*
app-config file name
*/}}
{{- define "backstage.appConfigFilename" -}}
{{- "app-config.development.yaml" -}}
{{- end -}}
