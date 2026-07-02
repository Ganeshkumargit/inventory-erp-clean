import Swal from "sweetalert2";

const confirmDelete = async (title = "Are you sure?") => {
  const result = await Swal.fire({
    title,
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it",
    cancelButtonText: "Cancel",
  });

  return result.isConfirmed;
};

export default confirmDelete;