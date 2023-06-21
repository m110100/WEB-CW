import {SpecialityResponse} from "./specialityResponse";

export interface AppointmentPatientsResponse {
  patientId: number,
  surname: string,
  name: string,
  patronymic: string,
  appointmentDate: string
}

export interface AppointmentDoctorsResponse {
  doctorId: number,
  surname: string,
  name: string,
  patronymic: string,
  speciality: SpecialityResponse
  appointmentDate: string
}
