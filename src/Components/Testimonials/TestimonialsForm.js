import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function TestimonialsForm() {
	const [dataTestimonials, setDataTestimonials] = useState({});
	const message = "Esta campo es obligatorio";
	const { id } = useParams();
	const inputImage = useRef();
	useEffect(() => {
		if (id) {
			axios
				.get(`https://ongapi.alkemy.org/api/testimonials/${id}`)
				.then(res => setDataTestimonials(res.data.data))
				.catch(error => console.log(error));
		}
	}, []);

	const convertBase64 = setFieldvalue => {
		const reader = new FileReader();
		reader.readAsDataURL(inputImage.current.files[0]);
		reader.onload = () => {
			const base64 = reader.result;
			setFieldvalue("image", base64);
		};
	};
	return (
		<div className="h-screen">
			<div className="w-full sm:w-full sm:mx-auto md:w-1/2 lg:w-4/5 md:mx-auto flex flex-col justify-center items-center">
				<Formik
					initialValues={{
						name: "",
						description: "",
						image: "",
					}}
					onSubmit={(values, { resetForm }) => {
						if (!id) {
							axios
								.post(`https://ongapi.alkemy.org/api/testimonials`, values)
								.then(res => console.log(res))
								.catch(err => console.log(err));

							
						} else {
							axios
								.put(`https://ongapi.alkemy.org/api/testimonials/${id}`, values)
								.then(res => console.log(res))
								.catch(err => console.log(err));

							
						}
						resetForm();
					}}
					validationSchema={() =>
						yup.object().shape({
							name: yup.string().required(message),
							description: yup.string().required(message),
							image: yup.string().required(),
						})
					}
				>
					{({ errors, setFieldValue, values, handleChange }) => (
						<Form className="w-4/5 sm:w-3/5 md:w-full md:mx-auto lg:w-3/5">
							<div className="mt-10">
								<h1 className="text-2xl font-semibold text-center pb-2 tracking-wide">
									{id ? "Actualiza el " : "Crea un "} testimonio
								</h1>
							</div>

							<div className="w-full flex flex-col  gap-4">
								<h3>Su nombre: </h3>
								<input
									className="h-12 w-full border border-slate-300 rounded-lg p-4"
									name="name"
									onChange={handleChange}
									defaultValue={dataTestimonials.name || ""}
									placeholder="Ingresa el nombre de la categoria"
								/>
								<ErrorMessage
									name="name"
									component={() => (
										<span className="text-red-400 text-xs">{errors.name}</span>
									)}
								/>
								<h3>Su testimonio: </h3>
								<CKEditor
									name="description"
									editor={ClassicEditor}
									data={dataTestimonials.description || values.description}
									onChange={(event, editor) => {
										setFieldValue("description", editor.getData());
									}}
									onBlur={(event, editor) => {}}
									onFocus={(event, editor) => {}}
								/>

								<ErrorMessage
									name="description"
									component={() => (
										<span className="text-red-400 text-xs">
											{errors.description}
										</span>
									)}
								/>
								<div className="flex  justify-between">
								<h3>Añada una imagen: </h3>
									<img
										className="h-auto w-3/6  rounded-lg"
										src={
											values.image === "" ? dataTestimonials.image : values.image
										}
									/>
									<div className="w-auto  bg-grey-lighter">
										<label className="w-auto flex flex-col items-center px-2 py-4 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-white">
											<svg
												className="w-8 h-8"
												fill="currentColor"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
											>
												<path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
											</svg>
											<span className="mt-2 text-sm font-medium leading-normal">
												Cambie la imagen
											</span>
											<input
												type="file"
												name="image"
												className="hidden"
												onChange={e => convertBase64(setFieldValue)}
												ref={inputImage}
												accept=".jpg, .png"
											/>
										</label>
									</div>
								</div>

								<ErrorMessage
									name="image"
									component={() => (
										<span className="text-red-400 text-xs">{errors.image}</span>
									)}
								/>

								<div className="w-auto mt-2">
									<button
										type="submit"
										className=" px-6 py-2 bg-sky-600   tracking-wide 
									rounded-lg  hover:bg-sky-500 hover:-translate-y-1 
									transition-all duration-500 text-white text-lg font-medium"
									>
										{!id ? "Subir testimonio" : "Actualizar testimonio"}
									</button>
								</div>
							</div>
						</Form>
					)}
				</Formik>
			</div>
		</div>
	);
}