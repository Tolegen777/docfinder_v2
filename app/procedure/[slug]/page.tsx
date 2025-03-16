import { ProcedureDetails } from "@/components/ProcedureDetails/ProcedureDetails";
import {ProcedureClinicsList} from "@/components/ProcedureDetails/ProcedureClinicsList/ProcedureClinicsList";

export default function Procedure() {
    return (
        <div>
            <ProcedureDetails />
            <ProcedureClinicsList />
        </div>
    );
}
